import mongoose from "mongoose";
import Cuenta from "../models/Cuenta.js";
import Transaccion from "../models/Transaccion.js";

function montoValido(valor) {
  const monto = Number(valor);
  return Number.isFinite(monto) && monto > 0 ? monto : null;
}

function idValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function respuestaError(res, status, mensaje) {
  return res.status(status).json({ mensaje });
}

export async function obtenerCuenta(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return respuestaError(res, 400, "El identificador de la cuenta no es válido.");
    }

    const cuenta = await Cuenta.findById(id).lean();

    if (!cuenta) {
      return respuestaError(res, 404, "Cuenta no encontrada.");
    }

    return res.json({ cuenta });
  } catch (error) {
    console.error("Error al obtener cuenta:", error);
    return respuestaError(res, 500, "Error interno al obtener la cuenta.");
  }
}

export async function depositar(req, res) {
  const { cuentaId, monto: montoEntrada } = req.body;
  const monto = montoValido(montoEntrada);

  if (!idValido(cuentaId) || !monto) {
    return respuestaError(res, 400, "Cuenta y monto positivo son obligatorios.");
  }

  const session = await mongoose.startSession();

  try {
    let cuentaActualizada;

    await session.withTransaction(async () => {
      cuentaActualizada = await Cuenta.findByIdAndUpdate(
        cuentaId,
        { $inc: { saldo: monto } },
        { new: true, session, runValidators: true }
      );

      if (!cuentaActualizada) {
        const error = new Error("CUENTA_NO_ENCONTRADA");
        throw error;
      }

      await Transaccion.create(
        [
          {
            tipo: "deposito",
            monto,
            cuentaDestino: cuentaActualizada._id
          }
        ],
        { session }
      );
    });

    return res.status(201).json({
      mensaje: "Depósito realizado correctamente.",
      cuenta: cuentaActualizada
    });
  } catch (error) {
    if (error.message === "CUENTA_NO_ENCONTRADA") {
      return respuestaError(res, 404, "Cuenta no encontrada.");
    }

    console.error("Error al depositar:", error);
    return respuestaError(
      res,
      500,
      "No se pudo completar el depósito. Verifica la conexión y configuración de MongoDB."
    );
  } finally {
    await session.endSession();
  }
}

export async function retirar(req, res) {
  const { cuentaId, monto: montoEntrada } = req.body;
  const monto = montoValido(montoEntrada);

  if (!idValido(cuentaId) || !monto) {
    return respuestaError(res, 400, "Cuenta y monto positivo son obligatorios.");
  }

  const session = await mongoose.startSession();

  try {
    let cuentaActualizada;

    await session.withTransaction(async () => {
      cuentaActualizada = await Cuenta.findOneAndUpdate(
        { _id: cuentaId, saldo: { $gte: monto } },
        { $inc: { saldo: -monto } },
        { new: true, session, runValidators: true }
      );

      if (!cuentaActualizada) {
        const cuentaExiste = await Cuenta.exists({ _id: cuentaId }).session(session);
        const error = new Error(cuentaExiste ? "SALDO_INSUFICIENTE" : "CUENTA_NO_ENCONTRADA");
        throw error;
      }

      await Transaccion.create(
        [
          {
            tipo: "retiro",
            monto,
            cuentaOrigen: cuentaActualizada._id
          }
        ],
        { session }
      );
    });

    return res.status(201).json({
      mensaje: "Retiro realizado correctamente.",
      cuenta: cuentaActualizada
    });
  } catch (error) {
    if (error.message === "CUENTA_NO_ENCONTRADA") {
      return respuestaError(res, 404, "Cuenta no encontrada.");
    }

    if (error.message === "SALDO_INSUFICIENTE") {
      return respuestaError(res, 400, "Saldo insuficiente para realizar el retiro.");
    }

    console.error("Error al retirar:", error);
    return respuestaError(
      res,
      500,
      "No se pudo completar el retiro. Verifica la conexión y configuración de MongoDB."
    );
  } finally {
    await session.endSession();
  }
}

export async function transferir(req, res) {
  const {
    cuentaOrigenId,
    cuentaDestino: numeroCuentaDestino,
    monto: montoEntrada
  } = req.body;
  const monto = montoValido(montoEntrada);
  const destinoNormalizado = String(numeroCuentaDestino ?? "").trim();

  if (!idValido(cuentaOrigenId) || !destinoNormalizado || !monto) {
    return respuestaError(
      res,
      400,
      "Cuenta origen, cuenta destino y monto positivo son obligatorios."
    );
  }

  const session = await mongoose.startSession();

  try {
    let cuentaOrigenActualizada;
    let cuentaDestinoActualizada;

    await session.withTransaction(async () => {
      const cuentaOrigen = await Cuenta.findById(cuentaOrigenId).session(session);

      if (!cuentaOrigen) {
        throw new Error("ORIGEN_NO_ENCONTRADO");
      }

      const cuentaDestino = await Cuenta.findOne({
        numeroCuenta: destinoNormalizado
      }).session(session);

      if (!cuentaDestino) {
        throw new Error("DESTINO_NO_ENCONTRADO");
      }

      if (cuentaOrigen._id.equals(cuentaDestino._id)) {
        throw new Error("MISMA_CUENTA");
      }

      if (cuentaOrigen.saldo < monto) {
        throw new Error("SALDO_INSUFICIENTE");
      }

      cuentaOrigenActualizada = await Cuenta.findOneAndUpdate(
        { _id: cuentaOrigen._id, saldo: { $gte: monto } },
        { $inc: { saldo: -monto } },
        { new: true, session, runValidators: true }
      );

      if (!cuentaOrigenActualizada) {
        throw new Error("SALDO_INSUFICIENTE");
      }

      cuentaDestinoActualizada = await Cuenta.findByIdAndUpdate(
        cuentaDestino._id,
        { $inc: { saldo: monto } },
        { new: true, session, runValidators: true }
      );

      await Transaccion.create(
        [
          {
            tipo: "transferencia",
            monto,
            cuentaOrigen: cuentaOrigen._id,
            cuentaDestino: cuentaDestino._id
          }
        ],
        { session }
      );
    });

    return res.status(201).json({
      mensaje: "Transferencia realizada correctamente.",
      cuenta: cuentaOrigenActualizada,
      destino: {
        numeroCuenta: cuentaDestinoActualizada.numeroCuenta,
        titular: cuentaDestinoActualizada.titular
      }
    });
  } catch (error) {
    const erroresNegocio = {
      ORIGEN_NO_ENCONTRADO: [404, "Cuenta origen no encontrada."],
      DESTINO_NO_ENCONTRADO: [404, "Cuenta destino no encontrada."],
      MISMA_CUENTA: [400, "No puedes transferir dinero a la misma cuenta."],
      SALDO_INSUFICIENTE: [400, "Saldo insuficiente para realizar la transferencia."]
    };

    if (erroresNegocio[error.message]) {
      const [status, mensaje] = erroresNegocio[error.message];
      return respuestaError(res, status, mensaje);
    }

    console.error("Error al transferir:", error);
    return respuestaError(
      res,
      500,
      "No se pudo completar la transferencia. Verifica la conexión y configuración de MongoDB."
    );
  } finally {
    await session.endSession();
  }
}

export async function obtenerHistorial(req, res) {
  try {
    const { id } = req.params;

    if (!idValido(id)) {
      return respuestaError(res, 400, "El identificador de la cuenta no es válido.");
    }

    const cuentaExiste = await Cuenta.exists({ _id: id });

    if (!cuentaExiste) {
      return respuestaError(res, 404, "Cuenta no encontrada.");
    }

    const transacciones = await Transaccion.find({
      $or: [{ cuentaOrigen: id }, { cuentaDestino: id }]
    })
      .sort({ fecha: -1 })
      .limit(20)
      .populate("cuentaOrigen", "numeroCuenta titular")
      .populate("cuentaDestino", "numeroCuenta titular")
      .lean();

    return res.json({ transacciones });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return respuestaError(res, 500, "Error interno al obtener el historial.");
  }
}

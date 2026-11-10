import { useCallback, useEffect, useState } from "react";
import AccionesBancarias from "./components/AccionesBancarias.jsx";
import Alerta from "./components/Alerta.jsx";
import FormDeposito from "./components/FormDeposito.jsx";
import FormRetiro from "./components/FormRetiro.jsx";
import FormTransferencia from "./components/FormTransferencia.jsx";
import HistorialTransacciones from "./components/HistorialTransacciones.jsx";
import Loading from "./components/Loading.jsx";
import Navbar from "./components/Navbar.jsx";
import SaldoCard from "./components/SaldoCard.jsx";
import {
  depositar,
  obtenerCuenta,
  obtenerHistorial,
  retirar,
  transferir
} from "./services/cuentaService.js";

const CUENTA_ID = import.meta.env.VITE_CUENTA_ID || "690000000000000000000001";

export default function App() {
  const [cuenta, setCuenta] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [operacionActiva, setOperacionActiva] = useState("deposito");
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const cargarDatos = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCargandoInicial(true);
      setMensaje({ tipo: "", texto: "" });
    }

    try {
      const [datosCuenta, datosHistorial] = await Promise.all([
        obtenerCuenta(CUENTA_ID),
        obtenerHistorial(CUENTA_ID)
      ]);

      setCuenta(datosCuenta.cuenta);
      setMovimientos(datosHistorial.transacciones);
      return { ok: true };
    } catch (error) {
      if (!silencioso) {
        setMensaje({ tipo: "error", texto: error.message });
      }
      return { ok: false, error };
    } finally {
      if (!silencioso) setCargandoInicial(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function ejecutarOperacion(accion) {
    setProcesando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const respuesta = await accion();

      if (respuesta.cuenta) {
        setCuenta(respuesta.cuenta);
      }

      const sincronizacion = await cargarDatos(true);

      if (!sincronizacion.ok) {
        setMensaje({
          tipo: "aviso",
          texto: `${respuesta.mensaje} La operación se completó, pero no se pudo actualizar el historial. Pulsa “Reintentar sincronización”.`
        });
        return true;
      }

      setMensaje({ tipo: "exito", texto: respuesta.mensaje });
      return true;
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
      return false;
    } finally {
      setProcesando(false);
    }
  }

  function validarMonto(monto) {
    if (!Number.isFinite(monto) || monto <= 0) {
      setMensaje({ tipo: "error", texto: "Ingresa un monto mayor que cero." });
      return false;
    }
    return true;
  }

  async function manejarDeposito(monto) {
    if (!validarMonto(monto)) return false;
    return ejecutarOperacion(() => depositar(CUENTA_ID, monto));
  }

  async function manejarRetiro(monto) {
    if (!validarMonto(monto)) return false;
    if (cuenta && monto > cuenta.saldo) {
      setMensaje({ tipo: "error", texto: "El monto supera el saldo disponible." });
      return false;
    }
    return ejecutarOperacion(() => retirar(CUENTA_ID, monto));
  }

  async function manejarTransferencia(destino, monto) {
    if (!destino) {
      setMensaje({ tipo: "error", texto: "Ingresa una cuenta destino." });
      return false;
    }
    if (!validarMonto(monto)) return false;
    if (cuenta?.numeroCuenta === destino) {
      setMensaje({ tipo: "error", texto: "No puedes transferir a tu misma cuenta." });
      return false;
    }
    if (cuenta && monto > cuenta.saldo) {
      setMensaje({ tipo: "error", texto: "El monto supera el saldo disponible." });
      return false;
    }
    return ejecutarOperacion(() => transferir(CUENTA_ID, destino, monto));
  }

  async function reintentarSincronizacion() {
    const resultado = await cargarDatos(false);
    if (resultado.ok) {
      setMensaje({ tipo: "exito", texto: "Datos actualizados correctamente." });
    }
  }

  if (cargandoInicial && !cuenta) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Loading />
        </main>
      </div>
    );
  }

  if (!cuenta) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-rose-400/20 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">No se pudo cargar la cuenta</p>
            <h1 className="mt-2 text-2xl font-black text-white">Revisa la conexión con la API y MongoDB.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {mensaje.texto || "No fue posible obtener los datos iniciales de la cuenta."}
            </p>
            <button
              type="button"
              onClick={() => cargarDatos(false)}
              className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Reintentar
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">Panel principal</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">Tu dinero, claro y bajo control.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Consulta tu saldo, realiza operaciones y revisa los movimientos registrados en MongoDB.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SaldoCard cuenta={cuenta} />
            <HistorialTransacciones movimientos={movimientos} cuentaId={CUENTA_ID} loading={cargandoInicial} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <AccionesBancarias activa={operacionActiva} onCambiar={setOperacionActiva} disabled={procesando} />

            <Alerta
              tipo={mensaje.tipo}
              mensaje={mensaje.texto}
              onCerrar={() => setMensaje({ tipo: "", texto: "" })}
              onReintentar={mensaje.tipo === "aviso" ? reintentarSincronizacion : undefined}
            />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
              {operacionActiva === "deposito" && <FormDeposito onSubmit={manejarDeposito} loading={procesando} />}
              {operacionActiva === "retiro" && <FormRetiro onSubmit={manejarRetiro} loading={procesando} />}
              {operacionActiva === "transferencia" && (
                <FormTransferencia onSubmit={manejarTransferencia} loading={procesando} />
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs leading-5 text-slate-500">
              <p className="font-semibold text-slate-400">Estado del sistema</p>
              <p className="mt-1">Frontend React + Vite · API Express · Persistencia MongoDB local</p>
            </section>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-900 px-4 py-6 text-center text-xs text-slate-600">
        Ingeniería Web · Sistema de Gestión de Cuenta Bancaria Simplificada
      </footer>
    </div>
  );
}

import "dotenv/config";
import mongoose from "mongoose";
import { conectarDB } from "../config/db.js";
import Cuenta from "../models/Cuenta.js";
import Transaccion from "../models/Transaccion.js";

const IDS = {
  principal: new mongoose.Types.ObjectId("690000000000000000000001"),
  ana: new mongoose.Types.ObjectId("690000000000000000000002"),
  luis: new mongoose.Types.ObjectId("690000000000000000000003"),
  maria: new mongoose.Types.ObjectId("690000000000000000000004")
};

// Los saldos actuales son coherentes con los movimientos sembrados debajo.
// Saldos base antes del historial de ejemplo:
// principal 2190, Ana 1550, Luis 3380, María 950.
const cuentas = [
  {
    _id: IDS.principal,
    numeroCuenta: "001-000001",
    titular: "Sánchez Quispe, Kevin Joseph Pedro",
    saldo: 2500
  },
  {
    _id: IDS.ana,
    numeroCuenta: "001-000002",
    titular: "Ana Torres Mendoza",
    saldo: 1800
  },
  {
    _id: IDS.luis,
    numeroCuenta: "001-000003",
    titular: "Luis Ramírez Soto",
    saldo: 3200
  },
  {
    _id: IDS.maria,
    numeroCuenta: "001-000004",
    titular: "María López Castro",
    saldo: 950
  }
];

const ahora = Date.now();
const movimientos = [
  // Depósitos iniciales que permiten reconstruir los saldos desde el historial.
  {
    tipo: "deposito",
    monto: 2190,
    cuentaDestino: IDS.principal,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 8)
  },
  {
    tipo: "deposito",
    monto: 1550,
    cuentaDestino: IDS.ana,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 8)
  },
  {
    tipo: "deposito",
    monto: 3380,
    cuentaDestino: IDS.luis,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 8)
  },
  {
    tipo: "deposito",
    monto: 950,
    cuentaDestino: IDS.maria,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 8)
  },
  {
    tipo: "deposito",
    monto: 500,
    cuentaDestino: IDS.principal,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 4)
  },
  {
    tipo: "retiro",
    monto: 120,
    cuentaOrigen: IDS.principal,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 3)
  },
  {
    tipo: "transferencia",
    monto: 250,
    cuentaOrigen: IDS.principal,
    cuentaDestino: IDS.ana,
    fecha: new Date(ahora - 1000 * 60 * 60 * 24 * 2)
  },
  {
    tipo: "transferencia",
    monto: 180,
    cuentaOrigen: IDS.luis,
    cuentaDestino: IDS.principal,
    fecha: new Date(ahora - 1000 * 60 * 60 * 18)
  }
];

async function ejecutarSeed() {
  try {
    await conectarDB();
    await Promise.all([Cuenta.deleteMany({}), Transaccion.deleteMany({})]);
    await Cuenta.insertMany(cuentas);
    await Transaccion.insertMany(movimientos);

    console.log("Seed completado correctamente.");
    console.log("Cuenta principal:");
    console.log(`  ID: ${IDS.principal}`);
    console.log("  Número: 001-000001");
    console.log("  Saldo actual: S/ 2,500.00");
    console.log("Cuentas destino de prueba: 001-000002, 001-000003, 001-000004");
  } catch (error) {
    console.error("Error al ejecutar seed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

ejecutarSeed();

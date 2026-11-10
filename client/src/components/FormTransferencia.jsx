import { useState } from "react";
import CampoMonto from "./CampoMonto.jsx";

export default function FormTransferencia({ onSubmit, loading }) {
  const [destino, setDestino] = useState("");
  const [monto, setMonto] = useState("");

  async function enviar(event) {
    event.preventDefault();
    const ok = await onSubmit(destino.trim(), Number(monto));
    if (ok) {
      setDestino("");
      setMonto("");
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Realizar transferencia</h2>
        <p className="mt-1 text-sm text-slate-400">Envía dinero a una cuenta existente del sistema.</p>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Cuenta destino</span>
        <input
          type="text"
          value={destino}
          onChange={(event) => setDestino(event.target.value)}
          disabled={loading}
          placeholder="Ejemplo: 001-000002"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          required
        />
      </label>
      <CampoMonto valor={monto} onChange={setMonto} disabled={loading} />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar transferencia"}
      </button>
      <p className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-500">
        Cuentas de prueba: 001-000002, 001-000003 y 001-000004.
      </p>
    </form>
  );
}

import { useState } from "react";
import CampoMonto from "./CampoMonto.jsx";

export default function FormRetiro({ onSubmit, loading }) {
  const [monto, setMonto] = useState("");

  async function enviar(event) {
    event.preventDefault();
    const ok = await onSubmit(Number(monto));
    if (ok) setMonto("");
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Realizar retiro</h2>
        <p className="mt-1 text-sm text-slate-400">El monto no puede superar el saldo disponible.</p>
      </div>
      <CampoMonto valor={monto} onChange={setMonto} disabled={loading} />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar retiro"}
      </button>
    </form>
  );
}

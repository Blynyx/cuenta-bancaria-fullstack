import { useState } from "react";
import CampoMonto from "./CampoMonto.jsx";

export default function FormDeposito({ onSubmit, loading }) {
  const [monto, setMonto] = useState("");

  async function enviar(event) {
    event.preventDefault();
    const ok = await onSubmit(Number(monto));
    if (ok) setMonto("");
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Realizar depósito</h2>
        <p className="mt-1 text-sm text-slate-400">Ingresa un monto positivo para aumentar el saldo.</p>
      </div>
      <CampoMonto valor={monto} onChange={setMonto} disabled={loading} />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar depósito"}
      </button>
    </form>
  );
}

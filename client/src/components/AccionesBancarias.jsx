const acciones = [
  { id: "deposito", etiqueta: "Depositar", simbolo: "+" },
  { id: "retiro", etiqueta: "Retirar", simbolo: "−" },
  { id: "transferencia", etiqueta: "Transferir", simbolo: "→" }
];

export default function AccionesBancarias({ activa, onCambiar, disabled }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
      {acciones.map((accion) => {
        const seleccionada = activa === accion.id;
        return (
          <button
            key={accion.id}
            type="button"
            disabled={disabled}
            onClick={() => onCambiar(accion.id)}
            className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              seleccionada
                ? "bg-white text-slate-950 shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className={`text-xl ${seleccionada ? "text-emerald-600" : "text-emerald-400"}`}>{accion.simbolo}</span>
            <span>{accion.etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Alerta({ tipo, mensaje, onCerrar, onReintentar }) {
  if (!mensaje) return null;

  const estilos = {
    error: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    aviso: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    exito: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  };

  return (
    <div
      role="status"
      className={`rounded-2xl border px-4 py-3 text-sm ${estilos[tipo] || estilos.exito}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p>{mensaje}</p>
        <button
          type="button"
          onClick={onCerrar}
          className="font-bold opacity-70 hover:opacity-100"
          aria-label="Cerrar mensaje"
        >
          ×
        </button>
      </div>

      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-3 rounded-lg border border-current/20 px-3 py-1.5 text-xs font-bold transition hover:bg-white/5"
        >
          Reintentar sincronización
        </button>
      )}
    </div>
  );
}

export default function CampoMonto({ valor, onChange, disabled }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">Monto</span>
      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950/60 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20">
        <span className="grid place-items-center border-r border-slate-700 px-4 text-sm font-bold text-slate-400">S/</span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          value={valor}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="0.00"
          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          required
        />
      </div>
    </label>
  );
}

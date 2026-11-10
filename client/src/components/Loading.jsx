export default function Loading({ texto = "Cargando información..." }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
        <p className="mt-4 text-sm text-slate-400">{texto}</p>
      </div>
    </div>
  );
}

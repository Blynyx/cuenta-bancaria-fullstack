function moneda(valor) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2
  }).format(valor ?? 0);
}

export default function SaldoCard({ cuenta }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-6 text-slate-950 shadow-2xl shadow-emerald-950/30 sm:p-8">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
      <div className="relative">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900/60">Saldo disponible</p>
            <p className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{moneda(cuenta?.saldo)}</p>
          </div>
          <div className="rounded-2xl border border-slate-950/10 bg-white/25 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900/60">Cuenta</p>
            <p className="mt-1 font-mono text-sm font-bold">{cuenta?.numeroCuenta || "—"}</p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-950/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-900/60">Titular</p>
          <p className="mt-1 text-sm font-bold sm:text-base">{cuenta?.titular || "Cargando..."}</p>
        </div>
      </div>
    </section>
  );
}

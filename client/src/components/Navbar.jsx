export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 font-black text-slate-950 shadow-lg shadow-emerald-400/20">
            MC
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Mi Cuenta</p>
            <p className="text-xs text-slate-400">Gestión bancaria simplificada</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
          Sistema Full-Stack
        </span>
      </div>
    </header>
  );
}

function moneda(valor) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2
  }).format(valor ?? 0);
}

function fecha(valor) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(valor));
}

function detalleMovimiento(movimiento, cuentaId) {
  const origen = movimiento.cuentaOrigen?.numeroCuenta || "—";
  const destino = movimiento.cuentaDestino?.numeroCuenta || "—";

  if (movimiento.tipo === "deposito") {
    return {
      titulo: "Depósito",
      signo: "+",
      clase: "text-emerald-300",
      detalles: [`Cuenta destino: ${destino}`]
    };
  }

  if (movimiento.tipo === "retiro") {
    return {
      titulo: "Retiro",
      signo: "−",
      clase: "text-amber-300",
      detalles: [`Cuenta origen: ${origen}`]
    };
  }

  const origenId = movimiento.cuentaOrigen?._id;
  const saliente = String(origenId) === String(cuentaId);

  return saliente
    ? {
        titulo: "Transferencia enviada",
        signo: "−",
        clase: "text-cyan-300",
        detalles: [`Origen: ${origen}`, `Destino: ${destino}`]
      }
    : {
        titulo: "Transferencia recibida",
        signo: "+",
        clase: "text-emerald-300",
        detalles: [`Origen: ${origen}`, `Destino: ${destino}`]
      };
}

export default function HistorialTransacciones({ movimientos, cuentaId, loading }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Actividad</p>
          <h2 className="mt-1 text-xl font-bold text-white">Historial de movimientos</h2>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {movimientos.length} registros
        </span>
      </div>

      <div className="mt-5 divide-y divide-slate-800">
        {loading && movimientos.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">Cargando movimientos...</p>
        ) : movimientos.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">Aún no hay movimientos registrados.</p>
        ) : (
          movimientos.map((movimiento) => {
            const detalle = detalleMovimiento(movimiento, cuentaId);
            return (
              <article key={movimiento._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-800 font-bold text-slate-200">
                    {detalle.signo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{detalle.titulo}</h3>
                    <div className="mt-0.5 space-y-0.5">
                      {detalle.detalles.map((texto) => (
                        <p key={texto} className="text-xs text-slate-500">{texto}</p>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{fecha(movimiento.fecha)}</p>
                  </div>
                </div>
                <p className={`font-mono text-base font-bold ${detalle.clase}`}>
                  {detalle.signo} {moneda(movimiento.monto)}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

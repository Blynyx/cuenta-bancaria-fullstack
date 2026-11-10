const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchJson(url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(opciones.headers || {})
    }
  });

  let datos = null;

  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    throw new Error(datos?.mensaje || `Error HTTP ${respuesta.status}`);
  }

  return datos;
}

export function obtenerCuenta(cuentaId) {
  return fetchJson(`${API_URL}/cuenta/${cuentaId}`);
}

export function obtenerHistorial(cuentaId) {
  return fetchJson(`${API_URL}/cuenta/${cuentaId}/historial`);
}

export function depositar(cuentaId, monto) {
  return fetchJson(`${API_URL}/cuenta/deposito`, {
    method: "POST",
    body: JSON.stringify({ cuentaId, monto })
  });
}

export function retirar(cuentaId, monto) {
  return fetchJson(`${API_URL}/cuenta/retiro`, {
    method: "POST",
    body: JSON.stringify({ cuentaId, monto })
  });
}

export function transferir(cuentaOrigenId, cuentaDestino, monto) {
  return fetchJson(`${API_URL}/cuenta/transferencia`, {
    method: "POST",
    body: JSON.stringify({ cuentaOrigenId, cuentaDestino, monto })
  });
}

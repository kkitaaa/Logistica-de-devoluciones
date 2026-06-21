import { apiUrl } from "./api";

const API = apiUrl("/api/solicitudes");

export async function obtenerSolicitudes() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Error al obtener solicitudes");
  }

  return await response.json();
}

export async function obtenerSolicitudPorId(id) {
  const response = await fetch(`${API}/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener solicitud por id");
  }

  return await response.json();
}

export async function registrarRevisionLogistica(id, payload) {
  const response = await fetch(`${API}/${id}/revision-logistica`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al registrar recepcion logistica");
  }

  return data;
}

export async function registrarEvaluacionTecnica(id, payload) {
  const response = await fetch(`${API}/${id}/evaluacion-tecnica`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al registrar evaluacion tecnica");
  }

  return data;
}

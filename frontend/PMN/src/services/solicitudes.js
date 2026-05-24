const API = "http://localhost:3000/api/solicitudes";

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
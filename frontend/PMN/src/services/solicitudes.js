const API = "http://localhost:3000/api/solicitudes";

export const obtenerSolicitudes = async () => {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Error al obtener solicitudes");
  }

  return await response.json();
};
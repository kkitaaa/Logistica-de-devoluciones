const {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitudPorId,
} = require("../services/solicitud.service");

// POST /solicitudes
async function insertarSolicitud(req, res) {
  const { id_pedido, motivo } = req.body;

  if (!id_pedido || !motivo) {
    return res.status(400).json({
      error: "id_pedido y motivo son obligatorios",
    });
  }

  try {
    const estado = await crearSolicitud(id_pedido, motivo);

    return res.json({
      mensaje:
        estado === "Aprobada"
          ? "Solicitud aprobada: garantía válida."
          : "Solicitud rechazada: garantía expirada o no disponible.",
      estado,
    });
  } catch (error) {
    console.error("Error al insertar solicitud:", error);

    return res.status(500).json({
      error: error.message || "Error al insertar la solicitud",
    });
  }
}

// GET /solicitudes
async function obtenerSolicitudes(req, res) {
  try {
    const solicitudes = await listarSolicitudes();
    return res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);

    return res.status(500).json({
      error: "Error al obtener solicitudes",
    });
  }
}

// GET /solicitudes/:id
async function obtenerSolicitudPorIdController(req, res) {
  const { id } = req.params;

  try {
    const solicitud = await obtenerSolicitudPorId(id);

    if (!solicitud) {
      return res.status(404).json({
        error: "Solicitud no encontrada",
      });
    }

    return res.json(solicitud);
  } catch (error) {
    console.error("Error al obtener solicitud:", error);

    return res.status(500).json({
      error: "Error al obtener la solicitud",
    });
  }
}

module.exports = {
  insertarSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorIdController,
};
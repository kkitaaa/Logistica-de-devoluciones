const { crearSolicitud } = require("../services/solicitud.service");

async function procesarDevolucion(req, res) {
  const { id_pedido, motivo, id_cliente } = req.body;

  try {
    const resultado = await crearSolicitud(id_pedido, motivo, id_cliente);

    return res.json({
      mensaje:
        resultado.estado === "Aprobada"
          ? "Solicitud aprobada: garantia valida."
          : "Solicitud rechazada: garantia expirada o no disponible.",
      ...resultado,
    });
  } catch (error) {
    console.error("Error al procesar devolucion:", error);

    return res.status(400).json({
      error: error.message || "Error interno en el servidor",
    });
  }
}

module.exports = { procesarDevolucion };

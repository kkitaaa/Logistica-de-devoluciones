const { crearSolicitud } = require('../services/solicitud.service');

async function procesarDevolucion(req, res) {
  const { id_pedido, motivo } = req.body;

  try {
    const estado = await crearSolicitud(id_pedido, motivo);

    if (estado === 'aprobado') {
      console.log("Solicitud aprobada: garantía válida.");
      res.json({ mensaje: "Solicitud aprobada: garantía válida." });
    } else {
      console.log("Solicitud rechazada: garantía expirada o no disponible.");
      res.json({ mensaje: "Solicitud rechazada: garantía expirada o no disponible." });
    }
  } catch (error) {
    console.error("Error al procesar devolución:", error);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
}

module.exports = { procesarDevolucion };

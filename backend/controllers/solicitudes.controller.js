const { crearSolicitud, listarSolicitudes } = require('../services/solicitud.service');

async function insertarSolicitud(req, res) {
  const { id_pedido, motivo } = req.body;

  try {
    const estado = await crearSolicitud(id_pedido, motivo);
    res.json({ mensaje: estado === 'aprobado' ? 'Solicitud aprobada: garantía válida.' : 'Solicitud rechazada: garantía expirada o no disponible.', estado });
  } catch (error) {
    console.error('Error al insertar solicitud:', error);
    res.status(400).json({ error: error.message || 'Error al insertar la solicitud' });
  }
}

async function obtenerSolicitudes(req, res) {
  try {
    const solicitudes = await listarSolicitudes();
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
}

module.exports = { insertarSolicitud, obtenerSolicitudes };

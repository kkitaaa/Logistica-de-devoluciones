const {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitudPorId,
  obtenerSolicitudesPorCliente,
  registrarRevisionLogistica,
  registrarEvaluacionTecnica,
} = require("../services/solicitud.service");

async function insertarSolicitud(req, res) {
  const { id_pedido, motivo, id_cliente } = req.body;

  if (!id_pedido || !motivo) {
    return res.status(400).json({
      error: "id_pedido y motivo son obligatorios",
    });
  }

  try {
    const resultado = await crearSolicitud(id_pedido, motivo, id_cliente);

    return res.json({
      mensaje:
        resultado.estado === "Aprobada"
          ? "Solicitud aprobada: garantia valida."
          : "Solicitud rechazada: garantia expirada o no disponible.",
      estado: resultado.estado,
      solicitud: resultado.solicitud,
    });
  } catch (error) {
    console.error("Error al insertar solicitud:", error);

    return res.status(400).json({
      error: error.message || "Error al insertar la solicitud",
    });
  }
}

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

async function obtenerMisSolicitudes(req, res) {
  const { id_cliente } = req.params;

  try {
    const solicitudes = await obtenerSolicitudesPorCliente(id_cliente);

    return res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes del cliente:", error);

    return res.status(500).json({
      error: "Error al obtener solicitudes del cliente",
    });
  }
}

async function recepcionarSolicitud(req, res) {
  const { id } = req.params;
  const { estado_producto, observacion, inconsistencia } = req.body;

  if (!estado_producto) {
    return res.status(400).json({ error: "estado_producto es obligatorio" });
  }

  try {
    const resultado = await registrarRevisionLogistica(
      id,
      estado_producto,
      observacion,
      inconsistencia 
    );

    return res.json({
      mensaje: resultado.estado === "En revision"
        ? "Recepción registrada con inconsistencia. Se deriva a revisión técnica."
        : "Recepción registrada sin inconsistencias.",
      ...resultado,
    });
  } catch (error) {
    console.error("Error al registrar recepcion logistica:", error);
    return res.status(400).json({ error: error.message || "Error al registrar recepcion logistica" });
  }
}

async function evaluarSolicitud(req, res) {
  const { id } = req.params;
  const { resolucion, observacion } = req.body;

  if (!resolucion) {
    return res.status(400).json({
      error: "resolucion es obligatoria",
    });
  }

  try {
    const resultado = await registrarEvaluacionTecnica(
      id,
      resolucion,
      observacion
    );

    return res.json({
      mensaje: "Evaluacion tecnica registrada.",
      ...resultado,
    });
  } catch (error) {
    console.error("Error al registrar evaluacion tecnica:", error);

    return res.status(400).json({
      error: error.message || "Error al registrar evaluacion tecnica",
    });
  }
}

const { listarSolicitudesEnRevision } = require("../services/solicitud.service"); 

async function obtenerSolicitudesEnRevisionController(req, res) {
  try {
    const solicitudes = await listarSolicitudesEnRevision();
    return res.json(solicitudes);
  } catch (error) {
    console.error("Error en endpoint en-revision:", error);
    return res.status(500).json({ error: "Error al obtener solicitudes en revision" });
  }
}

module.exports = {
  insertarSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorIdController,
  obtenerMisSolicitudes,
  recepcionarSolicitud,
  evaluarSolicitud,
  obtenerSolicitudesEnRevisionController,
};

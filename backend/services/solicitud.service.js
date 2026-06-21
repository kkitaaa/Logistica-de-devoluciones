const db = require("../db");

const ESTADOS_PRODUCTO = ["nuevo", "usado", "defectuoso", "danado", "incompleto"];
const RESOLUCIONES = ["reparacion", "reemplazo", "reembolso", "rechazo"];

async function crearSolicitud(id_pedido, motivo, id_cliente = null) {
  const pedidos = await db.select("pedido", {
    select: "id_pedido,id_cliente",
    id_pedido: `eq.${id_pedido}`,
    limit: "1",
  });

  const pedido = pedidos[0];

  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  if (id_cliente && String(pedido.id_cliente) !== String(id_cliente)) {
    throw new Error("El pedido no pertenece al cliente autenticado");
  }

  const productosPedido = await db.select("producto_pedido", {
    select: "id_producto",
    id_pedido: `eq.${id_pedido}`,
  });

  if (productosPedido.length === 0) {
    throw new Error("Pedido no encontrado o sin productos asociados");
  }

  const garantias = await db.select("garantia", {
    select: "disponibilidad,fecha_limite,id_producto",
    id_producto: db.inFilter(
      productosPedido.map((productoPedido) => productoPedido.id_producto)
    ),
  });

  const hoy = new Date();
  const garantiaValida =
    garantias.length === productosPedido.length &&
    garantias.every((garantia) => {
      const fechaLimite = new Date(garantia.fecha_limite);
      return garantia.disponibilidad && fechaLimite >= hoy;
    });

  const estado = garantiaValida ? "Aprobada" : "Rechazada";

  const solicitud = await db.insert("solicitud", {
    fecha: db.today(),
    motivo,
    estado,
    id_pedido,
  });

  return {
    estado,
    solicitud,
  };
}

async function listarSolicitudes() {
  const solicitudes = await db.select("solicitud", {
    select: "id_solicitud,fecha,estado,motivo,id_pedido",
    order: "id_solicitud.desc",
  });

  return completarSolicitudes(solicitudes);
}

async function obtenerSolicitudesPorCliente(id_cliente) {
  const clientes = await db.select("cliente", {
    select: "id_cliente,nombre_completo,numero_telefonico",
    id_cliente: `eq.${id_cliente}`,
    limit: "1",
  });

  if (clientes.length === 0) {
    return [];
  }

  const pedidos = await db.select("pedido", {
    select: "id_pedido,fecha,monto_total,id_cliente",
    id_cliente: `eq.${id_cliente}`,
  });

  if (pedidos.length === 0) {
    return [];
  }

  const solicitudes = await db.select("solicitud", {
    select: "id_solicitud,fecha,estado,motivo,id_pedido",
    id_pedido: db.inFilter(pedidos.map((pedido) => pedido.id_pedido)),
    order: "id_solicitud.desc",
  });

  return completarSolicitudesConDatos(solicitudes, pedidos, clientes);
}

async function obtenerSolicitudPorId(id) {
  const solicitudes = await db.select("solicitud", {
    select: "id_solicitud,fecha,estado,motivo,id_pedido",
    id_solicitud: `eq.${id}`,
    limit: "1",
  });

  const completas = await completarSolicitudes(solicitudes);

  return completas[0] || null;
}

async function registrarRevisionLogistica(
  id_solicitud,
  estado_producto,
  observacion = "",
  inconsistenciaManual = false
) {
  if (!ESTADOS_PRODUCTO.includes(estado_producto)) {
    throw new Error("Estado de producto no valido");
  }

  const solicitud = await obtenerSolicitudPorId(id_solicitud);

  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  if (solicitud.estado === "Rechazada") {
    throw new Error("No se puede recepcionar una solicitud rechazada por garantia");
  }

  const revision = await db.insert("revision_logistica", {
    estado_producto,
    observacion: observacion || null,
    inconsistencia: inconsistenciaManual, // Usamos la del botón
    id_solicitud,
  });

  const estado = inconsistenciaManual ? "En revision" : "Recepcionada";

  await actualizarEstadoSolicitud(id_solicitud, estado);

  return {
    revision,
    estado,
  };
}

async function registrarEvaluacionTecnica(
  id_solicitud,
  resolucion,
  observacion = ""
) {
  if (!RESOLUCIONES.includes(resolucion)) {
    throw new Error("Resolucion no valida");
  }

  const solicitud = await obtenerSolicitudPorId(id_solicitud);

  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  if (solicitud.estado === "Rechazada") {
    throw new Error("No se puede evaluar una solicitud rechazada por garantia");
  }

  const evaluacion = await db.insert("evaluacion_tecnica", {
    resolucion,
    observacion: observacion || null,
    fecha: db.today(),
    id_solicitud,
  });

  const estado = estadoPorResolucion(resolucion);

  await actualizarEstadoSolicitud(id_solicitud, estado);

  return {
    evaluacion,
    estado,
  };
}

async function actualizarEstadoSolicitud(id_solicitud, estado) {
  const rows = await db.update(
    "solicitud",
    { id_solicitud: `eq.${id_solicitud}` },
    { estado }
  );

  return rows[0];
}

async function completarSolicitudes(solicitudes) {
  if (solicitudes.length === 0) {
    return [];
  }

  const pedidos = await db.select("pedido", {
    select: "id_pedido,fecha,monto_total,id_cliente",
    id_pedido: db.inFilter(solicitudes.map((solicitud) => solicitud.id_pedido)),
  });

  const idClientes = [
    ...new Set(
      pedidos
        .map((pedido) => pedido.id_cliente)
        .filter((id_cliente) => id_cliente !== null && id_cliente !== undefined)
    ),
  ];

  const clientes =
    idClientes.length > 0
      ? await db.select("cliente", {
          select: "id_cliente,nombre_completo,numero_telefonico",
          id_cliente: db.inFilter(idClientes),
        })
      : [];

  return completarSolicitudesConDatos(solicitudes, pedidos, clientes);
}

function completarSolicitudesConDatos(solicitudes, pedidos, clientes) {
  const pedidoPorId = new Map(
    pedidos.map((pedido) => [pedido.id_pedido, pedido])
  );

  const clientePorId = new Map(
    clientes.map((cliente) => [cliente.id_cliente, cliente])
  );

  return Promise.all(solicitudes.map(async (solicitud) => {
    const pedido = pedidoPorId.get(solicitud.id_pedido);
    const cliente = pedido ? clientePorId.get(pedido.id_cliente) : null;
    const [revision, evaluacion] = await Promise.all([
      obtenerUltimaRevision(solicitud.id_solicitud),
      obtenerUltimaEvaluacion(solicitud.id_solicitud),
    ]);

    return {
      ...solicitud,
      fecha_pedido: pedido?.fecha ?? null,
      monto_total: pedido?.monto_total ?? null,
      nombre_completo: cliente?.nombre_completo ?? null,
      numero_telefonico: cliente?.numero_telefonico ?? null,
      revision_logistica: revision,
      evaluacion_tecnica: evaluacion,
    };
  }));
}

async function obtenerUltimaRevision(id_solicitud) {
  const revisiones = await db.select("revision_logistica", {
    select: "id_revision,estado_producto,observacion,inconsistencia,id_solicitud",
    id_solicitud: `eq.${id_solicitud}`,
    order: "id_revision.desc",
    limit: "1",
  });

  return revisiones[0] || null;
}

async function obtenerUltimaEvaluacion(id_solicitud) {
  const evaluaciones = await db.select("evaluacion_tecnica", {
    select: "id_evaluacion,resolucion,observacion,fecha,id_solicitud",
    id_solicitud: `eq.${id_solicitud}`,
    order: "id_evaluacion.desc",
    limit: "1",
  });

  return evaluaciones[0] || null;
}

function detectarInconsistencia(motivo, estado_producto) {
  const texto = normalizar(motivo);
  const declaraDefecto =
    texto.includes("defect") ||
    texto.includes("falla") ||
    texto.includes("problema") ||
    texto.includes("no funciona") ||
    texto.includes("mal estado");

  const declaraDano =
    texto.includes("dano") ||
    texto.includes("danado") ||
    texto.includes("golpe") ||
    texto.includes("roto");

  if (estado_producto === "defectuoso") {
    return !declaraDefecto && !declaraDano;
  }

  if (estado_producto === "danado") {
    return declaraDefecto && !declaraDano;
  }

  if (estado_producto === "nuevo" || estado_producto === "usado") {
    return declaraDefecto || declaraDano;
  }

  return false;
}

function estadoPorResolucion(resolucion) {
  const estados = {
    reparacion: "Reparacion aprobada",
    reemplazo: "Reemplazo aprobado",
    reembolso: "Reembolso aprobado",
    rechazo: "Rechazada",
  };

  return estados[resolucion];
}

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function listarSolicitudesEnRevision() {
  const solicitudes = await db.select("solicitud", {
    select: "id_solicitud,fecha,estado,motivo,id_pedido",
    estado: "eq.En revision", 
    order: "id_solicitud.desc",
  });

  return completarSolicitudes(solicitudes);
}


module.exports = {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitudPorId,
  obtenerSolicitudesPorCliente,
  registrarRevisionLogistica,
  registrarEvaluacionTecnica,
  listarSolicitudesEnRevision,
};

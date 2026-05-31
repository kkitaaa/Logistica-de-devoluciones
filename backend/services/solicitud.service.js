const connection = require('../db');

async function crearSolicitud(id_pedido, motivo) {
  const query = `
    SELECT g.disponibilidad, g.fecha_limite
    FROM Producto_Pedido pp
    JOIN Garantia g ON g.id_producto = pp.id_producto
    WHERE pp.id_pedido = ?;
  `;

  const [rows] = await connection.promise().query(query, [id_pedido]);

  if (rows.length === 0) {
    throw new Error('Pedido no encontrado o sin productos asociados');
  }

  const hoy = new Date();
  let garantiaValida = true;

  rows.forEach(row => {
    const fechaLimite = new Date(row.fecha_limite);

    if (!row.disponibilidad || fechaLimite < hoy) {
      garantiaValida = false;
    }
  });

  const estado = garantiaValida ? 'Aprobada' : 'Rechazada';

  await connection.promise().query(
    `
    INSERT INTO Solicitud (fecha, motivo, estado, id_pedido)
    VALUES (CURDATE(), ?, ?, ?)
    `,
    [motivo, estado, id_pedido]
  );

  return estado;
}

async function listarSolicitudes() {
  const [rows] = await connection.promise().query(`
    SELECT
      s.id_solicitud,
      s.fecha,
      s.estado,
      s.motivo,
      s.id_pedido,
      p.fecha AS fecha_pedido,
      p.monto_total,
      c.nombre_completo,
      c.numero_telefonico
    FROM Solicitud s
    JOIN Pedido p
      ON s.id_pedido = p.id_pedido
    JOIN Cliente c
      ON p.id_cliente = c.id_cliente
    ORDER BY s.id_solicitud DESC
  `);

  return rows;
}

async function obtenerSolicitudPorId(id) {
  const [rows] = await connection.promise().query(
    `
    SELECT
      s.id_solicitud,
      s.fecha,
      s.estado,
      s.motivo,
      s.id_pedido,
      p.fecha AS fecha_pedido,
      p.monto_total,
      c.nombre_completo,
      c.numero_telefonico
    FROM Solicitud s
    JOIN Pedido p
      ON s.id_pedido = p.id_pedido
    JOIN Cliente c
      ON p.id_cliente = c.id_cliente
    WHERE s.id_solicitud = ?
    `,
    [id]
  );

  return rows[0];
}

async function obtenerSolicitudesPorUsuario(idUsuario) {
  const [rows] = await connection.promise().query(
    `
    SELECT
      s.id_solicitud,
      s.fecha,
      s.estado,
      s.motivo,
      s.id_pedido,
      p.monto_total
    FROM Solicitud s
    JOIN Pedido p
      ON s.id_pedido = p.id_pedido
    JOIN Cliente c
      ON p.id_cliente = c.id_cliente
    WHERE c.id_usuario = ?
    ORDER BY s.id_solicitud DESC
    `,
    [idUsuario]
  );

  return rows;
}

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitudPorId,
  obtenerSolicitudesPorUsuario,
};
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
  const insertQuery = `
    INSERT INTO Solicitud (fecha, motivo, estado, id_pedido)
    VALUES (CURDATE(), ?, ?, ?);
  `;
  await connection.promise().query(insertQuery, [motivo, estado, id_pedido]);

  return estado;
}

async function listarSolicitudes() {
  const [rows] = await connection.promise().query(
    'SELECT id_solicitud, fecha, estado, motivo, id_pedido FROM Solicitud'
  );
  return rows;
}

module.exports = { crearSolicitud, listarSolicitudes };

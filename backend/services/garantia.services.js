const connection = require('../db');

async function validarGarantiaPedido(id_pedido) {
  const query = `
    SELECT p.id_producto, g.disponibilidad, g.fecha_limite
    FROM Producto_Pedido pp
    JOIN Producto p ON pp.id_producto = p.id_producto
    JOIN Garantia g ON g.id_producto = p.id_producto
    WHERE pp.id_pedido = ?;
  `;

  const [rows] = await connection.promise().query(query, [id_pedido]);
  const hoy = new Date();
  let valido = true;

  rows.forEach(row => {
    const fechaLimite = new Date(row.fecha_limite);
    if (!row.disponibilidad || fechaLimite < hoy) {
      valido = false;
    }
  });

  return valido;
}

module.exports = { validarGarantiaPedido };

const connection = require('../db');

async function crearPedido(fecha, monto_total, id_cliente, productos = []) {
  if (!fecha) {
    throw new Error('La fecha es obligatoria');
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('La lista de productos es obligatoria y no puede estar vacía');
  }

  const [result] = await connection.promise().query(
    'INSERT INTO Pedido (fecha, monto_total, id_cliente) VALUES (?, ?, ?)',
    [fecha, monto_total || 0, id_cliente || null]
  );

  const id_pedido = result.insertId;
  const values = productos.map(id_producto => [id_pedido, id_producto]);

  await connection.promise().query(
    'INSERT INTO Producto_Pedido (id_pedido, id_producto) VALUES ?',
    [values]
  );

  return {
    id_pedido,
    fecha,
    monto_total: monto_total || 0,
    id_cliente: id_cliente || null,
    productos
  };
}

async function listarPedidos() {
  const [rows] = await connection.promise().query(
    'SELECT id_pedido, fecha, monto_total, id_cliente FROM Pedido'
  );
  return rows;
}

async function obtenerPedidosPorUsuario(idUsuario) {
  const [rows] = await connection.promise().query(
    `
    SELECT
      p.id_pedido,
      p.fecha,
      p.monto_total
    FROM Pedido p
    INNER JOIN Cliente c
      ON p.id_cliente = c.id_cliente
    WHERE c.id_usuario = ?
    ORDER BY p.fecha DESC
    `,
    [idUsuario]
  );

  return rows;
}

module.exports = { crearPedido, listarPedidos, obtenerPedidosPorUsuario };

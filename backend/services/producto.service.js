const connection = require('../db');

async function crearProducto(nombre, precio, disponibilidad, fecha_limite) {
  if (!nombre || precio == null || disponibilidad == null || !fecha_limite) {
    throw new Error('Los campos nombre, precio, disponibilidad y fecha_limite son obligatorios');
  }

  const [result] = await connection.promise().query(
    'INSERT INTO Producto (nombre, precio) VALUES (?, ?)',
    [nombre, precio]
  );

  const id_producto = result.insertId;
  await connection.promise().query(
    'INSERT INTO Garantia (disponibilidad, fecha_limite, id_producto) VALUES (?, ?, ?)',
    [disponibilidad ? 1 : 0, fecha_limite, id_producto]
  );

  return {
    id_producto,
    nombre,
    precio,
    disponibilidad: Boolean(disponibilidad),
    fecha_limite
  };
}

async function listarProductos() {
  const [rows] = await connection.promise().query(
    `SELECT p.id_producto, p.nombre, p.precio, g.disponibilidad, g.fecha_limite
     FROM Producto p
     JOIN Garantia g ON g.id_producto = p.id_producto`
  );
  return rows;
}

module.exports = { crearProducto, listarProductos };

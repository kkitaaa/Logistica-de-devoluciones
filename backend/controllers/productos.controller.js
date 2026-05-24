const { crearProducto, listarProductos } = require('../services/producto.service');

async function insertarProducto(req, res) {
  const { nombre, precio, disponibilidad, fecha_limite } = req.body;

  try {
    const producto = await crearProducto(nombre, precio, disponibilidad, fecha_limite);
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al insertar producto:', error);
    res.status(400).json({ error: error.message || 'Error al insertar el producto' });
  }
}

async function obtenerProductos(req, res) {
  try {
    const productos = await listarProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

module.exports = { insertarProducto, obtenerProductos };

const { crearCliente, listarClientes } = require('../services/cliente.service');

async function insertarCliente(req, res) {
  const { nombre_completo, numero_telefonico } = req.body;

  try {
    const cliente = await crearCliente(nombre_completo, numero_telefonico);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    res.status(400).json({ error: error.message || 'Error al insertar el cliente' });
  }
}

async function obtenerClientes(req, res) {
  try {
    const clientes = await listarClientes();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}

module.exports = { insertarCliente, obtenerClientes };

const connection = require('../db');

async function crearCliente(nombre_completo, numero_telefonico) {
  if (!nombre_completo) {
    throw new Error('El nombre completo es obligatorio');
  }

  const [result] = await connection.promise().query(
    'INSERT INTO Cliente (nombre_completo, numero_telefonico) VALUES (?, ?)',
    [nombre_completo, numero_telefonico || null]
  );

  return {
    id_cliente: result.insertId,
    nombre_completo,
    numero_telefonico: numero_telefonico || null
  };
}

async function listarClientes() {
  const [rows] = await connection.promise().query(
    'SELECT id_cliente, nombre_completo, numero_telefonico FROM Cliente'
  );
  return rows;
}

module.exports = { crearCliente, listarClientes };

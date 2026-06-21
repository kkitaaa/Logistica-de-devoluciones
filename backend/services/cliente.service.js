const db = require("../db");

async function crearCliente(nombre_completo, numero_telefonico) {
  if (!nombre_completo) {
    throw new Error("El nombre completo es obligatorio");
  }

  return db.insert("cliente", {
    nombre_completo,
    numero_telefonico: numero_telefonico || null,
  });
}

async function listarClientes() {
  return db.select("cliente", {
    select: "id_cliente,nombre_completo,numero_telefonico",
    order: "id_cliente.asc",
  });
}

module.exports = { crearCliente, listarClientes };

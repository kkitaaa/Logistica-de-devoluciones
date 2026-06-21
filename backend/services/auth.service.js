const db = require("../db");

async function buscarUsuarioPorCorreo(correo) {
  const rows = await db.select("usuarios", {
    select: "*",
    correo: `eq.${correo}`,
    limit: "1",
  });

  return rows[0];
}

async function buscarClientePorUsuario(id_usuario) {
  const rows = await db.select("cliente", {
    select: "id_cliente,nombre_completo,numero_telefonico,id_usuario",
    id_usuario: `eq.${id_usuario}`,
    limit: "1",
  });

  return rows[0];
}

async function crearUsuario(
  nombre,
  correo,
  numero_telefonico,
  password,
  rol = "cliente"
) {
  const usuario = await db.insert("usuarios", {
    nombre,
    correo,
    password,
    rol,
  });

  let cliente = null;

  if (rol === "cliente") {
    cliente = await db.insert("cliente", {
      nombre_completo: nombre,
      numero_telefonico: numero_telefonico || null,
      id_usuario: usuario.id,
    });
  }

  return {
    id: usuario.id,
    nombre,
    correo,
    numero_telefonico: cliente?.numero_telefonico ?? numero_telefonico,
    id_cliente: cliente?.id_cliente ?? null,
    rol,
  };
}

module.exports = {
  buscarUsuarioPorCorreo,
  buscarClientePorUsuario,
  crearUsuario,
};

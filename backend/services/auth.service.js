const connection = require("../db");

async function buscarUsuarioPorCorreo(correo) {
  const [rows] = await connection.promise().query(
    `
    SELECT *
    FROM usuarios
    WHERE correo = ?
    `,
    [correo]
  );

  return rows[0];
}

async function crearUsuario(
  nombre,
  correo,
  numero_telefonico,
  password,
  rol = "cliente"
) {
  const [resultadoUsuario] =
    await connection.promise().query(
      `
      INSERT INTO usuarios
      (
        nombre,
        correo,
        password,
        rol
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        nombre,
        correo,
        password,
        rol,
      ]
    );

  const idUsuario = resultadoUsuario.insertId;

  // Si es cliente, crear relación automáticamente
  if (rol === "cliente") {
    await connection.promise().query(
      `
      INSERT INTO Cliente
      (
        nombre_completo,
        numero_telefonico,
        id_usuario
      )
      VALUES (?, ?, ?)
      `,
      [
        nombre,
        numero_telefonico,
        idUsuario,
      ]
    );
  }

  return {
    id: idUsuario,
    nombre,
    correo,
    numero_telefonico,
    rol,
  };
}

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
};
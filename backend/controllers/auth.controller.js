const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  buscarUsuarioPorCorreo,
  crearUsuario
} = require('../services/auth.service');

async function register(req, res) {
  const {
    nombre,
    correo,
    numero_telefonico,
    password,
    rol
  } = req.body;

  try {

    const usuarioExistente =
      await buscarUsuarioPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await crearUsuario(
      nombre,
      correo,
      numero_telefonico,
      hash,
      rol || 'cliente'
    );

    return res.status(201).json(usuario);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error al registrar usuario'
    });

  }
}

async function login(req, res) {

  const { correo, password } = req.body;

  try {

    const usuario =
      await buscarUsuarioPorCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado'
      });
    }

    const passwordValida =
      await bcrypt.compare(
        password,
        usuario.password
      );

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol
      },
      'pmv-secret-key',
      {
        expiresIn: '1d'
      }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        numero_telefonico: usuario.numero_telefonico,
        rol: usuario.rol
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error al iniciar sesión'
    });

  }
}

module.exports = {
  register,
  login
};
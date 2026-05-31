const express = require('express');
const { procesarDevolucion } = require('../controllers/devoluciones.controller');
const { insertarProducto, obtenerProductos } = require('../controllers/productos.controller');
const { insertarPedido, obtenerPedidos } = require('../controllers/pedidos.controller');
const { insertarCliente, obtenerClientes } = require('../controllers/clientes.controller');
const {insertarSolicitud, obtenerSolicitudes,  obtenerSolicitudPorIdController,  obtenerMisSolicitudes} = require('../controllers/solicitudes.controller');
const { obtenerGarantias } = require('../controllers/garantias.controller');
const {register, login} = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/cliente:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear un cliente
 *     description: Inserta un cliente en la base de datos.
 */
router.post('/cliente', insertarCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Listar clientes
 *     description: Obtiene todos los clientes registrados.
 */
router.get('/clientes', obtenerClientes);

/**
 * @swagger
 * /api/producto:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Insertar un producto con garantía
 *     description: Crea un producto y su registro de garantía.
 */
router.post('/producto', insertarProducto);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Listar productos
 *     description: Obtiene los productos junto con su garantía.
 */
router.get('/productos', obtenerProductos);

/**
 * @swagger
 * /api/pedido:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear pedido
 *     description: Inserta un pedido y asocia productos.
 */
router.post('/pedido', insertarPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Listar pedidos
 */
router.get('/pedidos', obtenerPedidos);

/**
 * @swagger
 * /api/solicitud:
 *   post:
 *     tags:
 *       - Solicitudes
 *     summary: Crear solicitud de devolución
 */
router.post('/solicitud', insertarSolicitud);

/**
 * @swagger
 * /api/devolucion:
 *   post:
 *     tags:
 *       - Solicitudes
 *     summary: Procesar devolución
 */
router.post('/devolucion', insertarSolicitud);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Obtener todas las solicitudes
 */
router.get('/solicitudes', obtenerSolicitudes);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Obtener solicitud por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 */
router.get('/solicitudes/:id', obtenerSolicitudPorIdController);

/**
 * @swagger
 * /api/mis-solicitudes/{idUsuario}:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Obtener solicitudes del usuario
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de solicitudes del usuario
 */
router.get('/mis-solicitudes/:idUsuario', obtenerMisSolicitudes);

/**
 * @swagger
 * /api/garantias:
 *   get:
 *     tags:
 *       - Garantías
 *     summary: Listar garantías
 */
router.get('/garantias', obtenerGarantias);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registrar usuario
 *     description: Crea un nuevo usuario cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               numero_telefonico:
 *                 type: string
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/auth/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/auth/login', login);

module.exports = router;
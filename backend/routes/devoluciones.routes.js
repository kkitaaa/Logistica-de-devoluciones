const express = require('express');
const { verificarToken, verificarRol, verificarAccesoCliente } = require('../middleware/auth');
const { procesarDevolucion } = require('../controllers/devoluciones.controller');
const { insertarProducto, obtenerProductos } = require('../controllers/productos.controller');
const { insertarPedido, obtenerPedidos, obtenerMisPedidos } = require('../controllers/pedidos.controller');
const { insertarCliente, obtenerClientes } = require('../controllers/clientes.controller');
const {
  insertarSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorIdController,
  obtenerMisSolicitudes,
  recepcionarSolicitud,
  evaluarSolicitud,
} = require('../controllers/solicitudes.controller');
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_completo
 *               - numero_telefonico
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               numero_telefonico:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               productos:
 *                 type: array
 *                 items:
 *                   type: integer
 *               cantidad:
 *                 type: integer
 *               fecha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
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
 * /api/mis-pedidos/{id_cliente}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener pedidos de un cliente
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 */
router.get(
  '/mis-pedidos/:id_cliente',
  obtenerMisPedidos
);

/**
 * @swagger
 * /api/solicitud:
 *   post:
 *     tags:
 *       - Solicitudes
 *     summary: Crear solicitud de devolución
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pedido
 *               - motivo
 *             properties:
 *               id_pedido:
 *                 type: integer
 *               motivo:
 *                 type: string
 *               id_cliente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/solicitud', verificarToken, verificarRol('cliente'), insertarSolicitud);

/**
 * @swagger
 * /api/devolucion:
 *   post:
 *     tags:
 *       - Solicitudes
 *     summary: Procesar devolución
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idSolicitud:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Devolución procesada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/devolucion', verificarToken, verificarRol('cliente'), insertarSolicitud);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Obtener todas las solicitudes
 */
router.get('/solicitudes', verificarToken, obtenerSolicitudes);

router.get('/solicitudes/:id', verificarToken, obtenerSolicitudPorIdController);

router.post('/solicitudes/:id/revision-logistica', verificarToken, verificarRol('operador_logistica', 'admin'), recepcionarSolicitud);

router.post('/solicitudes/:id/evaluacion-tecnica', verificarToken, verificarRol('evaluador_tecnico', 'admin'), evaluarSolicitud);

/**
 * @swagger
 * /api/mis-solicitudes/{id_cliente}:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Obtener solicitudes del cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de solicitudes del cliente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver estos datos
 */
router.get('/mis-solicitudes/:id_cliente', verificarToken, verificarAccesoCliente, obtenerMisSolicitudes);

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

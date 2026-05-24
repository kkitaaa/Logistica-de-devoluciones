const express = require('express');
const { procesarDevolucion } = require('../controllers/devoluciones.controller');
const { insertarProducto, obtenerProductos } = require('../controllers/productos.controller');
const { insertarPedido, obtenerPedidos } = require('../controllers/pedidos.controller');
const { insertarCliente, obtenerClientes } = require('../controllers/clientes.controller');
const { insertarSolicitud, obtenerSolicitudes } = require('../controllers/solicitudes.controller');
const { obtenerGarantias } = require('../controllers/garantias.controller');
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
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: "Juan Pérez"
 *               numero_telefonico:
 *                 type: string
 *                 example: "5551234567"
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
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
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/clientes', obtenerClientes);

/**
 * @swagger
 * /api/producto:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Insertar un producto con garantía
 *     description: Crea un producto y su registro de garantía en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Mouse inalámbrico"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 250.00
 *               disponibilidad:
 *                 type: boolean
 *                 example: true
 *               fecha_limite:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Producto creado con garantía
 */
router.post('/producto', insertarProducto);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Listar productos
 *     description: Obtiene los productos junto con su información de garantía.
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/productos', obtenerProductos);

/**
 * @swagger
 * /api/pedido:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear un pedido con productos
 *     description: Inserta un pedido y asocia los productos seleccionados al pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-01"
 *               monto_total:
 *                 type: number
 *                 format: float
 *                 example: 1250.00
 *               id_cliente:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 */
router.post('/pedido', insertarPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Listar pedidos
 *     description: Obtiene los pedidos registrados.
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/pedidos', obtenerPedidos);

/**
 * @swagger
 * /api/solicitud:
 *   post:
 *     tags:
 *       - Solicitudes
 *     summary: Insertar solicitud de devolución
 *     description: Crea una solicitud y valida la garantía de los productos del pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido:
 *                 type: integer
 *                 example: 1
 *               motivo:
 *                 type: string
 *                 example: "Producto defectuoso"
 *     responses:
 *       200:
 *         description: Resultado de la validación de garantía
 */
router.post('/solicitud', insertarSolicitud);
router.post('/devolucion', insertarSolicitud);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     tags:
 *       - Solicitudes
 *     summary: Listar solicitudes
 *     description: Obtiene todas las solicitudes de devolución.
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get('/solicitudes', obtenerSolicitudes);

/**
 * @swagger
 * /api/garantias:
 *   get:
 *     tags:
 *       - Garantías
 *     summary: Listar garantías
 *     description: Obtiene todos los registros de garantía.
 *     responses:
 *       200:
 *         description: Lista de garantías
 */
router.get('/garantias', obtenerGarantias);

module.exports = router;

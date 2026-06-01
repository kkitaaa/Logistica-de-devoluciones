const { crearPedido, listarPedidos, obtenerPedidosPorUsuario } = require('../services/pedido.service');

async function insertarPedido(req, res) {
  const { fecha, monto_total, id_cliente, productos } = req.body;

  try {
    const pedido = await crearPedido(fecha, monto_total, id_cliente, productos);
    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al insertar pedido:', error);
    res.status(400).json({ error: error.message || 'Error al crear el pedido' });
  }
}

async function obtenerPedidos(req, res) {
  try {
    const pedidos = await listarPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
}

async function obtenerMisPedidos(req, res) {
  const { idUsuario } = req.params;

  try {
    const pedidos =
      await obtenerPedidosPorUsuario(idUsuario);

    return res.json(pedidos);

  } catch (error) {

    console.error(
      'Error al obtener pedidos del usuario:',
      error
    );

    return res.status(500).json({
      error: 'Error al obtener pedidos'
    });

  }
}

module.exports = { insertarPedido, obtenerPedidos, obtenerMisPedidos };

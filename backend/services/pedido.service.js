const db = require("../db");

async function crearPedido(fecha, monto_total, id_cliente, productos = []) {
  if (!fecha) {
    throw new Error("La fecha es obligatoria");
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error("La lista de productos es obligatoria y no puede estar vacia");
  }

  const pedido = await db.insert("pedido", {
    fecha,
    monto_total: monto_total || 0,
    id_cliente: id_cliente || null,
  });

  await Promise.all(
    productos.map((id_producto) =>
      db.insert("producto_pedido", {
        id_pedido: pedido.id_pedido,
        id_producto,
      })
    )
  );

  return {
    id_pedido: pedido.id_pedido,
    fecha,
    monto_total: monto_total || 0,
    id_cliente: id_cliente || null,
    productos,
  };
}

async function listarPedidos() {
  const { data, error } = await db.select("pedido", {
    select: "id_pedido,fecha,monto_total,id_cliente",
    order: "id_pedido.asc",
  });

  if (error) throw new Error(error.message);

  return data;
}

async function obtenerPedidosPorCliente(id_cliente) {
  return db.select("pedido", {
    select: "id_pedido,fecha,monto_total,id_cliente",
    id_cliente: `eq.${id_cliente}`,
    order: "fecha.desc",
  });
}

module.exports = { crearPedido, listarPedidos, obtenerPedidosPorCliente };

const db = require("../db");

async function validarGarantiaPedido(id_pedido) {
  const productosPedido = await db.select("producto_pedido", {
    select: "id_producto",
    id_pedido: `eq.${id_pedido}`,
  });

  if (productosPedido.length === 0) {
    return false;
  }

  const garantias = await db.select("garantia", {
    select: "disponibilidad,fecha_limite,id_producto",
    id_producto: db.inFilter(
      productosPedido.map((productoPedido) => productoPedido.id_producto)
    ),
  });

  const hoy = new Date();

  return garantias.every((garantia) => {
    const fechaLimite = new Date(garantia.fecha_limite);
    return garantia.disponibilidad && fechaLimite >= hoy;
  });
}

async function listarGarantias() {
  const garantias = await db.select("garantia", {
    select: "id_garantia,disponibilidad,fecha_limite,id_producto",
    order: "id_garantia.asc",
  });

  const ids = garantias.map((garantia) => garantia.id_producto);

  if (ids.length === 0) {
    return [];
  }

  const productos = await db.select("producto", {
    select: "id_producto,nombre",
    id_producto: db.inFilter(ids),
  });

  const productoPorId = new Map(
    productos.map((producto) => [producto.id_producto, producto])
  );

  return garantias.map((garantia) => ({
    ...garantia,
    nombre: productoPorId.get(garantia.id_producto)?.nombre ?? null,
  }));
}

module.exports = { validarGarantiaPedido, listarGarantias };

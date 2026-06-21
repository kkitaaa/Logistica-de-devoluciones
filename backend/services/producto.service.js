const db = require("../db");

async function crearProducto(nombre, precio, disponibilidad, fecha_limite) {
  if (!nombre || precio == null || disponibilidad == null || !fecha_limite) {
    throw new Error(
      "Los campos nombre, precio, disponibilidad y fecha_limite son obligatorios"
    );
  }

  const producto = await db.insert("producto", {
    nombre,
    precio,
  });

  await db.insert("garantia", {
    disponibilidad: Boolean(disponibilidad),
    fecha_limite,
    id_producto: producto.id_producto,
  });

  return {
    id_producto: producto.id_producto,
    nombre,
    precio,
    disponibilidad: Boolean(disponibilidad),
    fecha_limite,
  };
}

async function listarProductos() {
  const productos = await db.select("producto", {
    select: "id_producto,nombre,precio",
    order: "id_producto.asc",
  });

  const ids = productos.map((producto) => producto.id_producto);

  if (ids.length === 0) {
    return [];
  }

  const garantias = await db.select("garantia", {
    select: "id_producto,disponibilidad,fecha_limite",
    id_producto: db.inFilter(ids),
  });

  const garantiaPorProducto = new Map(
    garantias.map((garantia) => [garantia.id_producto, garantia])
  );

  return productos.map((producto) => ({
    ...producto,
    disponibilidad:
      garantiaPorProducto.get(producto.id_producto)?.disponibilidad ?? null,
    fecha_limite:
      garantiaPorProducto.get(producto.id_producto)?.fecha_limite ?? null,
  }));
}

module.exports = { crearProducto, listarProductos };

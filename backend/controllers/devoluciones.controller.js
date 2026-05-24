import { validarGarantiaPedido } from "../services/garantia.services.js";

async function procesarDevolucion(req, res) {
  const { id_pedido } = req.body;

  try {
    const garantiaValida = await validarGarantiaPedido(id_pedido);

    if (garantiaValida) {
      console.log("📢 Pedido válido para devolución/reemplazo.");

      res.json({
        mensaje: "Pedido válido para devolución/reemplazo."
      });

    } else {
      console.log("📢 Pedido rechazado, garantía expirada o no disponible.");

      res.json({
        mensaje: "Pedido rechazado, garantía expirada o no disponible."
      });
    }

  } catch (error) {
    console.error("Error en validación:", error);

    res.status(500).json({
      error: "Error interno en validación"
    });
  }
}

export { procesarDevolucion };
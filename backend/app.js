import express from "express";
import devolucionesRoutes from "./routes/devoluciones.routes.js";

const app = express();

app.use("/api", devolucionesRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo");
});
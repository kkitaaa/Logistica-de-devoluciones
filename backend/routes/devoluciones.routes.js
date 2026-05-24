import { Router } from "express";
import { procesarDevolucion } from "../controllers/devoluciones.controller.js";

const router = Router();

router.post("/devolucion", procesarDevolucion);

export default router;
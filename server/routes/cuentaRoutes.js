import { Router } from "express";
import {
  depositar,
  obtenerCuenta,
  obtenerHistorial,
  retirar,
  transferir
} from "../controllers/cuentaController.js";

const router = Router();

router.get("/:id/historial", obtenerHistorial);
router.get("/:id", obtenerCuenta);
router.post("/deposito", depositar);
router.post("/retiro", retirar);
router.post("/transferencia", transferir);

export default router;

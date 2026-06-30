import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware";

const router = Router()

// rutas para ADMIN
router.get("/",verificarToken,getUsers)

export default router
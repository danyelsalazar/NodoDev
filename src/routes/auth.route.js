import {Router} from "express"
import { registerUser, loginUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"

const router = Router();

// ruta para registrarse:
router.post("/register", validarRegistro, registerUser)
// ruta para loguearse
router.post("/login", loginUser)

export default router
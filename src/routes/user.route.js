import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"
import authRoute from "./auth.route.js"
import { verificarToken } from "../middleware/authMiddleware.js"
import { getUser } from "../controllers/user.controller.js"
const router = Router()

// rutas de autenticacion
router.use("/auth", authRoute)

// ruta para traer los datos del usuario, uso la veificacion del token
router.get("/", verificarToken, getUser)
// rutas para informacion o modificacion del usuario:

export default router
import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"
import authRoute from "./auth.route.js"
const router = Router()

// rutas de autenticacion
router.use("/auth", authRoute)
// rutas para informacion o modificacion del usuario:

export default router
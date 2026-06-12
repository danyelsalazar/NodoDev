import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"
import authRoute from "./auth.route.js"
import { verificarToken } from "../middleware/authMiddleware.js"
import { deleteUser, getUser, patchUser } from "../controllers/user.controller.js"
import { validarPatchUser } from "../middleware/patchUserMiddleware.js"
const router = Router()

router.use("/auth", authRoute)// rutas de autenticacion
router.get("/", verificarToken, getUser)// ruta para traer los datos del usuario, uso la veificacion del token
router.patch("/", verificarToken, validarPatchUser, patchUser )// ruta para actualizar los datos del usuario
router.delete("/",verificarToken, deleteUser )

export default router
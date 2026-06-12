import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"
import authRoute from "./auth.route.js"
import { verificarToken } from "../middleware/authMiddleware.js"
import { deleteUser, getUser, patchUser } from "../controllers/user.controller.js"
import { validarPatchUser } from "../middleware/patchUserMiddleware.js"
import { registrarMateriaUser } from "../controllers/registrarMateriaUser.controller.js"
import { listarMaterias } from "../controllers/listarMateriasUser.controller.js"
const router = Router()

router.use("/auth", authRoute)// rutas de autenticacion
router.get("/", verificarToken, getUser)// ruta para traer los datos del usuario, uso la veificacion del token
router.patch("/", verificarToken, validarPatchUser, patchUser )// ruta para actualizar los datos del usuario
router.delete("/",verificarToken, deleteUser )//ruta para eliminar usuario
router.post("/materia", verificarToken, registrarMateriaUser) //ruta para registrar una amateria al usuario
router.get("/materia", verificarToken, listarMaterias)//ruta para listar las materias del usaurio

export default router
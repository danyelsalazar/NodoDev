import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"
import { verificarToken } from "../middleware/authMiddleware.js"
import { deleteUser, getUser, patchUser } from "../controllers/user.controller.js"
import { validarPatchUser } from "../middleware/patchUserMiddleware.js"
import { registrarMateriaUser } from "../controllers/registrarMateriaUser.controller.js"
import { listarMaterias } from "../controllers/listarMateriasUser.controller.js"
import { allowRoles } from "../middleware/rolesMiddleware.js"
import { ROLES } from "../constants/roles.js"
import { validarQueryPublicaciones } from "../middleware/validateQueryPublications.js"
import { createPublication, getPublications } from "../controllers/publication.controller.js"
import { validarCrearPublicacion } from "../middleware/validarPublication.js"

const router = Router()

router.get("/", verificarToken, allowRoles(ROLES.ADMIN,ROLES.USER), getUser)// ruta para traer los datos del usuario, uso la veificacion del token
router.patch("/", verificarToken, allowRoles(ROLES.ADMIN,ROLES.USER), validarPatchUser, patchUser )// ruta para actualizar los datos del usuario
router.delete("/",verificarToken, deleteUser )//ruta para eliminar usuario
router.post("/materia", verificarToken, registrarMateriaUser) //ruta para registrar una amateria al usuario
router.get("/materia", verificarToken, listarMaterias)//ruta para listar las materias del usaurio

router.post("/publication",verificarToken, allowRoles(ROLES.ADMIN, ROLES.USER), validarCrearPublicacion,createPublication ) //crear publicaciones
router.get("/publications", verificarToken, allowRoles(ROLES.ADMIN, ROLES.USER), validarQueryPublicaciones, getPublications)//listar publicaciones

export default router
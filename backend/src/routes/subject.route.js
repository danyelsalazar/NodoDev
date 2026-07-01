import {Router} from "express"
import { validarSubject } from "../middleware/validarSubject.js"
import { crearSubject } from "../controllers/subject.controller.js"
import { verificarToken } from "../middleware/authMiddleware.js"
import { allowRoles } from "../middleware/rolesMiddleware.js"
import { ROLES } from "../constants/roles.js"

const router = Router()

// creacion de materias: 
router.post("/", verificarToken, allowRoles(ROLES.ADMIN), validarSubject, crearSubject)

export default router
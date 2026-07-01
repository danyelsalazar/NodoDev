import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import { allowRoles } from "../middleware/rolesMiddleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { createPublication, getPublications } from "../controllers/publication.controller.js";
import { validarQueryUsuarios } from "../middleware/validateQueryUser.js";
import { validarQueryPublicaciones } from "../middleware/validateQueryPublications.js";
import { validarAdminPatchUser } from "../middleware/validateAdminPatchUser.js";
import { adminPatchUser } from "../controllers/admin.controller.js";
import { validarParamId } from "../middleware/validarIDUserMiddleware.js";

const router = Router()

router.get("/",verificarToken, allowRoles(ROLES.ADMIN), validarQueryUsuarios, getUsers)//listarUsuarios
router.patch("/:id", verificarToken, allowRoles(ROLES.ADMIN), validarParamId, validarAdminPatchUser, adminPatchUser)//editar usuarios

//eliminar usuarios
//...

//eliminar publicaciones de usuarios
//...



//
export default router
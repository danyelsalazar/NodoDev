import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import { allowRoles } from "../middleware/rolesMiddleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { createPublication, getPublications } from "../controllers/publication.controller.js";
import { validarQueryUsuarios } from "../middleware/validateQueryUser.js";
import { validarQueryPublicaciones } from "../middleware/validateQueryPublications.js";

const router = Router()

//traer usuarios
router.get("/",verificarToken, allowRoles(ROLES.ADMIN), validarQueryUsuarios, getUsers)//listarUsuarios

export default router
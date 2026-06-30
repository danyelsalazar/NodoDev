import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import { allowRoles } from "../middleware/rolesMiddleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { createPublication, getPublications } from "../controllers/publication.controller.js";

const router = Router()

//traer usuarios
router.get("/",verificarToken, allowRoles(ROLES.ADMIN), getUsers)//listarUsuarios
router.post("/",verificarToken, allowRoles(ROLES.ADMIN), createPublication ) //crear publicaciones
router.get("/publications", verificarToken, allowRoles(ROLES.ADMIN), getPublications)//listar publicaciones

export default router
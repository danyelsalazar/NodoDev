import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import { allowRoles } from "../middleware/rolesMiddleware.js";
import { getUsers } from "../controllers/user.controller.js";

const router = Router()

//traer usuarios
router.get("/",verificarToken, allowRoles(ROLES.ADMIN), getUsers)

export default router
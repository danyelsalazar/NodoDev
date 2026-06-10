import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js"
import { validarRegistro } from "../middleware/validarRegistroMiddleware.js"

const router = Router()

router.get("/", (req, res)=>{
    res.json({
        message: "Lista de usuarios"
    })
})

router.post("/auth/register", validarRegistro, registerUser)

export default router
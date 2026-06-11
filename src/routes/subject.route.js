import {Router} from "express"
import { validarSubject } from "../middleware/validarSubject.js"
import { crearSubject } from "../controllers/subject.controller.js"
const router = Router()

router.get("/", (req, res)=>{
    res.json({
        message: "Lista de materias"
    })
})

// creacion de materias: 
router.post("/", validarSubject, crearSubject)

export default router
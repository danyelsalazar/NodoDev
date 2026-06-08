import {Router} from "express"

const router = Router()

router.get("/subjects", (req, res)=>{
    res.json({
        message: "Lista de materias"
    })
})

export default router
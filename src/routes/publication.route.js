import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.json({
        message: "lista de Publicaciones"
    })
})

export default router
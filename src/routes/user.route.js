import {Router} from "express"

const router = Router()

router.get("/users", (req, res)=>{
    res.json({
        message: "Lista de usuarios"
    })
})

export default router
import {Router} from "express"
import userRoute from "./user.route.js"
import subjectRoute from "./subject.route.js"
import publicationRoute from "./publication.route.js"
import authRoute from "./auth.route.js"

// declaramos e inicializamos el enrutador
const router = Router()

//armo las rutas que usare segun sea la ocasion usuario o materias: 
router.use("/user", userRoute)
router.use("/subject", subjectRoute )
router.use("/publication", publicationRoute)

// ahora armo la ruta para autenticacion de usuario que los enviara a login o register segun sea el caso
router.use("/auth", authRoute)// rutas de autenticacion

export default router
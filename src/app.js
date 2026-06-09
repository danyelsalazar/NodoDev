import express from "express"
import routes from "./routes/routes.js"
import {config} from "dotenv"
import cors from "cors"

config() // cargo las variables de entorno

// creo servidor basico
const servidor = express()

// pongo las coors para que el frontend pueda consumir mi api sin problemas de cors
servidor.use(cors())

// defino la entrada de la ruta para mi servidor
servidor.use("/api", routes)

// armo una ruta de aterrizaje
servidor.get("/", (req,res) =>{
    res.send("Servidor funcionando")
})
// pongo el servidor en escucha
servidor.listen(process.env.PORT, ()=>{
    console.log(`servidor corriendo en http://localhost:${process.env.PORT}`);
})
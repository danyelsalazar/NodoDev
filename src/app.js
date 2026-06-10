import express from "express"
import routes from "./routes/routes.js"
import {config} from "dotenv"
import cors from "cors"
import connectDB from "./db/mongoDbConnection.js"

config() // cargo las variables de entorno

// creo servidor basico
const servidor = express()
// coneccto con la base de datos 
connectDB()

// pongo las coors para que el frontend pueda consumir mi api sin problemas de cors
servidor.use(cors())
// le decimos a express que use json
servidor.use(express.json());

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
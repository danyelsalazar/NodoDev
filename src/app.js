import express from "express"
import subjectRoutes from "./routes/subject.route.js"
import userRoutes from "./routes/user.route.js"

// creo servidor basico
const app = express()

// defino las rutas que podra usar mi app
app.use(userRoutes)
app.use(subjectRoutes)


app.get("/", (req,res) =>{
    res.send("Servidor funcionando")
})

app.listen(3000, ()=>{
    console.log("servidor corriendo en http://localhost:3000");
})
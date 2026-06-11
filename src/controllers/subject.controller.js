import {Subject} from "../models/SubjectModel.js"

const crearSubject = async (req , res)=>{
    try {
        const datosSubject = req.body
        // busco la materia en la base de datos para verificar que no existe ya
        const exist = await Subject.findOne({nombre: datosSubject.nombre.trim()})
        
        if(exist) return res.status(409).json({
            succes: false,
            error: "La materia ya esta registrada"
        })

        // si no esta registrada la registro
        // creo una materia
        const newSubject = new Subject(datosSubject)
        // guardo la materia
        await newSubject.save()

        res.status(201).json({
            succes: true,
            data: {
                nombre: newSubject.nombre,
                carreras: newSubject.carreras
            },
            message: "Materia creada exitosamanete"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error del servidor",
            error: error.message
        })
    }
}

export {crearSubject}
import { User } from "../models/UserModel.js";

const listarMaterias = async (req, res)=>{
    try {
        // traemos los datos del token 
        const datosToken = req.user
        // busco el usurio y pueblo el campo materias con los datos reales
        const usuarioConMaterias = await User.findById(datosToken.id)
        .populate("materias")
        .select("materias")//seleciono unicamante las materias para que ahorre tiempo de busqueda

        // verifico si el usaurio no existe en la bd
        if(!usuarioConMaterias) return res.status(404).json({
            success: false,
            error: "El usaurio no existe o fue eliminado, verifca el token"
        })
        // mando el arreglo de las ,materias del usuario ya poblado
        res.status(200).json({
            success: true,
            cantidad_de_materias: usuarioConMaterias.materias.length,
            data: usuarioConMaterias.materias,
            message: "Materias del usaurio"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Error del servidor",
            error: error.message
        })
    }
}

export {listarMaterias}
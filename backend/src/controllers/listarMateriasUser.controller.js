import { User } from "../models/UserModel.js";
import { AppError } from "../utils/AppError.js";

const listarMaterias = async (req, res, next) => {
  try {
    // Traemos los datos del token
    const datosToken = req.user;

    // Busco el usuario, selecciono el campo y luego lo pueblo con los datos reales
    const usuarioConMaterias = await User.findById(datosToken.id)
      .select("materias") // Selecciono únicamente las materias primero para ahorrar rendimiento
      .populate("materias"); // Pueblo el campo con el modelo Subject

    // Verifico si el usuario no existe en la BD
    if (!usuarioConMaterias) {
      return next(
        new AppError("El usuario ya no existe en la base de datos", 404),
      );
    }

    // Mando el arreglo de las materias del usuario ya poblado
    res.status(200).json({
      success: true,
      cantidad_de_materias: usuarioConMaterias.materias.length,
      data: usuarioConMaterias.materias,
      message: "Materias del usuario obtenidas correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export { listarMaterias };

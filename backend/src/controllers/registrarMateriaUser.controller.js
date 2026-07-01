import { User } from "../models/UserModel.js";
import { Subject } from "../models/SubjectModel.js";
import { AppError } from "../utils/AppError.js";

// Función específica para que el usuario agregue una materia a su arreglo de materias
const registrarMateriaUser = async (req, res, next) => {
  try {
    // Obtengo el id de la materia
    const { idMateria } = req.body;
    // Obtengo los datos del token
    const datosToken = req.user;

    // Valido que la materia exista en la BD
    const materia = await Subject.findById(idMateria);

    // Verifico si trajo la materia
    if (!materia) {
      return next(
        new AppError("La materia no se encontró en la base de datos", 404),
      );
    }

    // Valido que el usuario esté en la base de datos
    const userExist = await User.findById(datosToken.id);

    // Verifico si existe el usuario
    if (!userExist) {
      return next(
        new AppError("El usuario ya no existe en la base de datos", 404),
      );
    }

    // Si se verificó la materia y el usuario, continuo con la actualización
    const userActualizado = await User.findByIdAndUpdate(
      datosToken.id,
      { $addToSet: { materias: idMateria } }, // Guardo el id sin duplicarlo gracias al operador de Mongo
      { returnDocument: "after" },
    ).select("-password");

    res.status(200).json({
      success: true,
      data: userActualizado,
      message: "¡¡¡Registro de materia a usuario exitoso!!!",
    });
  } catch (error) {
    next(error);
  }
};

export { registrarMateriaUser };

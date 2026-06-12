import { User } from "../models/UserModel.js";
import { Subject } from "../models/SubjectModel.js";

//funcion especifica para que el usuario agrege una materia su arreglo de materias
const registrarMateriaUser = async (req, res) => {
  try {
    // obtengo el id de la materia
    const { idMateria } = req.body;
    // obtengo los datos del token
    const datosToken = req.user;
    // valido que la materia exista en la bd
    const materia = await Subject.findById(idMateria);

    // verifoc si trajo la materia
    if (!materia)
      return res.status(404).json({
        success: false,
        error: "La materia no se encontro en la Base de datos",
      });
    // valido que el usuario este en la base de datos
    const userExist = await User.findById(datosToken.id);
    // verifico que existe el usuario
    if (!userExist)
      return res.status(404).json({
        success: false,
        error: "El usaurio no existe o fue eliminado, verifia el token",
      });
    // si verifico la materia y el usaurio,  continuo con la actualizacion al usuario
    const userActualizado = await User.findByIdAndUpdate(
      datosToken.id,
      { $addToSet: { materias: idMateria } }, //guardo el id sin duplicarlo
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      data: userActualizado,
      message: "Registro de materia a usuario exitosa!!!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

export {registrarMateriaUser}
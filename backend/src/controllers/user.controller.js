import { User } from "../models/UserModel.js";
import { Subject } from "../models/SubjectModel.js";
import { AppError } from "../utils/AppError.js";

// ======= OBTENER DATOS DE MI PERFIL =======
const getUser = async (req, res, next) => {
  try { // Corregido: Agregado bloque try/catch para proteger la consulta asíncrona
    const datosToken = req.user;

    const dataUser = await User.findById(datosToken.id).select("-password");
    
    if (!dataUser) {
      return next(new AppError("El usuario solicitado no existe", 404));
    }

    res.status(200).json({ // Corregido a status 200 (OK)
      success: true,
      data: dataUser,
    });
  } catch (error) {
    next(error);
  }
};

// ======= MODIFICAR MIS DATOS DE PERFIL =======
const patchUser = async (req, res, next) => {
  try {
    const datosToken = req.user;
    const datosActualizacion = req.body;

    //prevenimos la alteración del password desde este endpoint
    delete datosActualizacion.password;

    const { materias } = datosActualizacion;

    if (materias) {
      const cantMaterias = await verificadorMateriasExist(materias);
      if (cantMaterias < materias.length) {
        return next(new AppError("Una de las materias enviadas no existe en la base de datos", 404));
      }
    }

    const userActualizado = await User.findByIdAndUpdate(
      datosToken.id,
      datosActualizacion,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    if (!userActualizado) {
      return next(new AppError("El usuario que intentas modificar no existe o fue eliminado", 404));
    }
    
    res.status(200).json({
      success: true,
      data: userActualizado,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Función auxiliar para contar materias válidas
const verificadorMateriasExist = async (materias) => {
  const cantMaterias = await Subject.countDocuments({
    _id: { $in: materias },
  });
  return cantMaterias;
};

// ======= ELIMINAR MI PROPIA CUENTA =======
const deleteUser = async (req, res, next) => {
  try {
    const datosToken = req.user;

    const userDelete = await User.findByIdAndDelete(datosToken.id);

    if (!userDelete) {
      return next(new AppError("El usuario solicitado no existe o ya fue eliminado", 404));
    }

    res.status(200).json({ // Corregido a status 200 (OK)
      success: true,
      message: `La cuenta de ${userDelete.nombre} (${userDelete.email}) fue eliminada correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

export { getUser, patchUser, deleteUser };

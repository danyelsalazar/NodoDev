import { success } from "zod";
import { User } from "../models/UserModel.js";

//funcion para traer los datos del usuario
const getUser = async (req, res) => {
  const datosToken = req.user;
  //busco los datos de ese usaurio dueno del token sin la passsword
  //algo que puede pasar es que sea un token valido para el servidor pero que ese usaurio haya sido eliminado entonces agarro y manejo ese caso mas abajo en el if
  const dataUser = await User.findById(datosToken.id).select("-password");
  if (!dataUser)
    return res.status(404).json({
      succes: false,
      message: "El usuario solicitado no existe",
    });
  //si existe ya tendriamos los datos del usuario:
  res.status(201).json({
    success: true,
    data: dataUser,
  });
};

//Funcion para modificar los datos del usuario
const patchUser = async (req, res) => {
  try {
    // traigo el id del usuario logueado que es al que le voy a cambiar los datos
    const datosToken = req.user;
    // traigo los datos de actulizacion ya verificados
    const datosActualizacion = req.body;
    //hago los cambios en la basee de datos
    const userActualizado = await User.findByIdAndUpdate(
      datosToken.id,
      datosActualizacion,
      {
        new: true,
        runValidators: true, //le digo que use las validaciones que le puse ene l schema ya que como es una actualizacion mongo se salta esa parte si no le indico que la use
      },
    ).select("-password"); //aqui por siacaso le digo que no me selecione la password en la actulizacion y asi tambien omite el hasheo de password

    // verifico en caso de que el id no exista en la base de datos o por si se elimino ese usuario
    if(!userActualizado) return res.status(404).json({
        success: false,
        message: "El usuario que intentas modificar no existe o fue eliminado "
    })
    res.status(201).json({
      success: true,
      data: userActualizado,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

// funcion para eliminar usuario, para mi es como si fuera usaurio de un ared social asi que desde mi perfil tengo acceso a eliminar mi cuenta

const deleteUser = async (req, res) => {
  try {
    //lo mismo que la funcion anterior
    const datosToken = req.user;
    // busco el usuario por su id y lo elimino
    const userDelete = await User.findByIdAndDelete(datosToken.id);
    // verico si si elimino o si no elimino porque no existe ya ese usuario
    if (!userDelete)
      return res.status(404).json({
        success: false,
        message: "El usuario solicitado no existe o ya fue eliminado",
      });
    // si si existia continuo y aviso de la eliminacion
    res.status(201).json({
      success: true,
      message: `La cuenta de ${userDelete.nombre} (${userDelete.email}) fue eliminada correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error del servidor",
      error: error.message,
    });
  }
};

export { getUser, patchUser, deleteUser };

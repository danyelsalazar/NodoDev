import { User } from "../models/UserModel.js";

//path de usarios
const adminPatchUser = async (req, res) => {
  try {
    const { id } = req.params; // Capturamos el id del usuario que vamos a modificar ya viene validado con su middleware
    const datosActualizados = req.body; // Ya vienen los campos limpios por el zod

    // Buscamos y actualizamos en un solo viaje a la base de datos
    // { new: true } -> devuelve el documento modificado
    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      datosActualizados,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password"); // Excluyo la password por seguridad

    // Si no se encontró ningún usuario con ese ID, Mongoose devuelve null
    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "El usuario enviado en la URL no existe en la base de datos",
      });
    }

    // Si todo sale bien manda la respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al actualizar el usuario",
      error: error.message,
    });
  }
};

//delete user
const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params; //obtengo el id ya esta validado con su middleware

    //verifico que el mismo administrador no se vaya a eliminar jajaj :)
    if(id === req.user.id){
        return res.status(400).json({
        success: false,
        message: "No te puedes eliminar tu mismo :)",
      });
    }
    const deleteUser = await User.findByIdAndDelete(id).select("-password");

    //verifico si si existi:
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "No se encontro ningun usuario registrado con el ID enviado",
      });
    }

    //si lo encontro enviamos la respuesta positiva
    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al eliminar el usuario",
      error: error.message,
    });
  }
};

export { adminPatchUser, adminDeleteUser };

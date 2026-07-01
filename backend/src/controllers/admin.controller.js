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
  } catch (error) {}
};

export { adminPatchUser };

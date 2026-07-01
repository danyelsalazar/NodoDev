import { User } from "../models/UserModel";

//path de usarios
const adminPatchUser = async (req, res) => {
  try {
    const { id } = req.params; // Capturamos el id del usuario que vamos a modificar
    const datosActualizados = req.body; // Ya vienen los campos limpios por el zod

    // Valido el formato del id del usuario
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "El ID de usuario enviado en la URL no es válido",
      });
    }

    // Buscamos y actualizamos en un solo viaje a la base de datos
    // { new: true } -> devuelve el documento modificado
    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      datosActualizados,
      {
        new: true,
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

//para probarlo:

// {
//   "nombre": "Carlos Administrado",
//   "email": "carlos.actualizado@mail.com",
//   "role": "ADMIN",
//   "materias": [
//     "64b0f1a2c3d4e5f6a7b8c9d0",
//     "64b0f1a2c3d4e5f6a7b8c9d1"
//   ]
// }

export { adminPatchUser };

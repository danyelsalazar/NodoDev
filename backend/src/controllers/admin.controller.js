import { User } from "../models/UserModel.js";
import { AppError } from "../utils/AppError.js";

//traer los usuarios
const getUsers = async (req, res, next) => {
  try {
    //los parametrtos ya vienen validados con el middleware validateQueryUser
    const { page, limit, role } = req.query;
    let filtro = {};

    if (role) {
      filtro.role = role;
    }

    // cuantos cumplen con el filtrado por rol, asi se cuanto es el total que traere y podeer hacer los calculos de paginacion
    const total = await User.countDocuments(filtro);

    // usuarios paginados :
    const users = await User.find(filtro)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page: page,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error)
  }
};

//path de usarios
const adminPatchUser = async (req, res, next) => {
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
      return next(new AppError("El usuario enviado en la URL no existe en la base de datos", 404));
    }

    // Si todo sale bien manda la respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    next(error);
  }
};

//delete user
const adminDeleteUser = async (req, res, next) => {
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
      return next(new AppError("No se encontro ningun usuario registrado con el ID enviado", 404))
    }

    //si lo encontro enviamos la respuesta positiva
    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: deleteUser,
    });
  } catch (error) {
    next(error)
  }
};

export { adminPatchUser, adminDeleteUser, getUsers };

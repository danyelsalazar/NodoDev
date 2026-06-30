import { success } from "zod";
import { User } from "../models/UserModel.js";
import { Subject } from "../models/SubjectModel.js";

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
    //si se llega mandar una password en esa informacion la saco ya que esto es solo para actualizar sus datos de perfil , la actualizacion de password la hare por separado
    delete datosActualizacion.password;
    //destructuro y obtengom los ids de la/s materias asi los verifico si exiten esas materias o no
    const { materias } = datosActualizacion;
    // compruebo que haya enviado materias en la actualizacion
    if (materias) {
      // mandamos las materias y verificamos que existan en la bd
      const cantMaterias = await verificadorMateriasExist(materias);
      //si el cantMaterias es menor que la cantidad de materias enviadas es porque alguna no existe en la bd
      if (cantMaterias < materias.length) {
        return res.status(404).json({
          success: false,
          message: "Una de las materias enviadas no existe en la base de datos",
        });
      }
    }
    //hago los cambios en la basee de datos
    const userActualizado = await User.findByIdAndUpdate(
      datosToken.id,
      datosActualizacion,
      {
        new: true,
        runValidators: true, //le digo que use las validaciones que le puse ene l schema ya que como es una actualizacion mongo se salta esa parte si no le indico que la use
      },
    ).select("-password"); //aqui por siacaso le digo que no me selecione la password asi no lo devuelve luego de la actualizacion

    // verifico en caso de que el id no exista en la base de datos o por si se elimino ese usuario
    if (!userActualizado)
      return res.status(404).json({
        success: false,
        message: "El usuario que intentas modificar no existe o fue eliminado ",
      });
    res.status(200).json({
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

const verificadorMateriasExist = async (materias) => {
  // contamos cuantos de los IDs recibidos existen realmente en la base de datos
  const cantMaterias = await Subject.countDocuments({
    _id: { $in: materias },
  });
  return cantMaterias;
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

//===================================================================
//================ FUNCIONES PARA ADMIN =============================
//===================================================================
const getUsers = async (req, res) => {
  try {
    // obtengo los parametros, si no los envio les asigno un valor default
    const { page = 1, limit = 5, role } = req.query;
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
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error del servidor",
      error: error.message,
    });
  }
};

export { getUser, patchUser, deleteUser, getUsers };

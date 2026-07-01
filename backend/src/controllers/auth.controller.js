import { User } from "../models/UserModel.js";
import bcrypto from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

// ==================
// aqui pondre la logica de negocio para el registro y logueo del usuario
//===========================

// mis funciones seran asincronas porque debo espera respuestas de la base de datos

// ======= REGISTRO DE USUARIO
const registerUser = async (req, res, next) => {
  try {
    // obtengo los datos enviados en body
    const datosUser = req.body;

    //busco el email en la base de datos a ver si existe ya
    const emailIsreadyExist = await User.findOne({ email: datosUser.email });
    // verifico si exite
    if (emailIsreadyExist) {
      return next(new AppError("El email ya esta en uso", 400))
    }
    // si no existe creo el usuario
    await User.create(datosUser);

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    next(error)
  }
};

//========= LOGUEO DE USAURIO
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // busco en la base de datos el usuario con ese email
    const userLoginSearch = await User.findOne({ email: email });
    // verifico si existe
    if (!userLoginSearch)
      return next(new AppError("Credenciales incorrectas (Correo o contraseña inválidos)", 401))
    //Ahora debo verificar que las password coincidan
    const isMatch = await bcrypto.compare(password, userLoginSearch.password);
    // verifico si hay coincidencia
    if (!isMatch)
      return next(new AppError("No autorizado", 401))
    //creo el token para el usuario
    const token = jwt.sign(
      { id: userLoginSearch._id, role: userLoginSearch.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      data: {
        token: token,
      },
      message: "Usuario logueado",
    });
  } catch (error) {
    next(error)
  }
};

export { registerUser, loginUser };

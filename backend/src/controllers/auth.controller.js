import { User } from "../models/UserModel.js";
import bcrypto from "bcrypt";
import jwt from "jsonwebtoken";

// ==================
// aqui pondre la logica de negocio para el registro y logueo del usuario
//===========================

// mis funciones seran asincronas porque debo espera respuestas de la base de datos

// ======= REGISTRO DE USUARIO
const registerUser = async (req, res) => {
  try {
    // obtengo los datos enviados en body
    const datosUser = req.body;

    //busco el email en la base de datos a ver si existe ya
    const emailIsreadyExist = await User.findOne({ email: datosUser.email });
    // verifico si exite
    if (emailIsreadyExist) {
      return res.status(400).json({
        success: false,
        error: "El email ya esta en uso",
      });
    }
    // si no existe creo el usuario
    const nuevoUsuario = new User(datosUser);
    // lo guardo en la tabla de usuarios:
    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

//========= LOGUEO DE USAURIO
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // busco en la base de datos el usuario con ese email
    const userLoginSearch = await User.findOne({ email: email });
    // verifico si existe
    if (!userLoginSearch)
      return res.status(404).json({
        succes: false,
        message: "El correo ingresado no esta registrado",
      });
    //Ahora debo verificar que las password coincidan
    const isMatch = await bcrypto.compare(password, userLoginSearch.password);
    // verifico si hay coincidencia
    if (!isMatch)
      return res.status(401).json({
        succes: false,
        error: "No autorizado",
      });

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
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

export { registerUser, loginUser };

import { User } from "../models/UserModel.js";

const getUser = async (req, res) => {
  const datosToken = req.user;
  //busco los datos de ese usuario que esta logueado en especifico sin la passsword
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

export { getUser };

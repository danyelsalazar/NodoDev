import { Publication } from "../models/PublicationModel";
import { User } from "../models/UserModel";

const createPublication = async (req, res) => {
  try {
    const data = req.body;
    const idPublicador = req.user.id;

    // Verifico que el usuario exista en la BD
    const exist = await User.findById(idPublicador);

    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "El usuario no existe en la base de datos",
      });
    }

    // Guardamos la publicación en la BD
    const newPublication = await Publication.create({ 
      ...data, 
      publicador: idPublicador 
    });

    res.status(201).json({
      success: true,
      message: "Publicacion creada con exito",
      data: newPublication
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

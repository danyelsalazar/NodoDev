import { success } from "zod";
import { Publication } from "../models/PublicationModel.js";
import { Subject } from "../models/SubjectModel.js";
import { User } from "../models/UserModel.js";

//crear publicacion
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
      publicador: idPublicador,
    });

    res.status(201).json({
      success: true,
      message: "Publicacion creada con exito",
      data: newPublication,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

const getPublications = async (req, res) => {
  try {
    // req.query ya viene limpio, validado y con números reales gracias al middleware de validacion de parametros
    const { page, limit, materia } = req.query;
    let filtro = {};

    if (materia) {
      const materiaEncontrada = await Subject.findOne({
        nombre: { $regex: materia, $options: "i" },
      });

      if (!materiaEncontrada) {
        return res.status(200).json({
          success: true,
          count: 0,
          page,
          totalPages: 0,
          message: "La materia de filtrado no existe in la BD",
          data: [],
        });
      }
      filtro.materia = materiaEncontrada._id;
    }

    const totalPublications = await Publication.countDocuments(filtro);

    if (totalPublications < 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        page,
        totalPages: 0,
        message: "No hay publicaciones disponibles para esta consulta",
        data: [],
      });
    }

    const publications = await Publication.find(filtro)
      .sort({ createdAt: -1 })
      .populate("publicador", "nombre")
      .populate("materia", "nombre")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: publications.length,
      page,
      totalPages: Math.ceil(totalPublications / limit),
      data: publications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

export { createPublication, getPublications };

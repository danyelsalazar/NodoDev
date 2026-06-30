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

// listar las publicaciones
const getPublications = async (req, res) => {
  try {
    const { page = 1, limit = 10, materia } = req.query;
    let filtro = {};

    //si nos mandan el parametro materia
    if (materia) {
      // Buscamos la materia usando el parametro
      const materiaEncontrada = await Subject.findOne({
        nombre: { $regex: materia, $options: "i" },
      });

      // Si la materia no existe en la BD
      if (!materiaEncontrada) {
        return res.status(200).json({
          success: true,
          count: 0,
          page: Number(page),
          totalPages: 0,
          message: "La materia de filtrado no existe en la BD",
          data: [],
        });
      }

      // Si existe, asignamos su ID al filtro
      filtro.materia = materiaEncontrada._id;
    }

    // Cuento la cantidad de publicaciones que cumplen con el filtro (sea el de materia o vacío para todas)
    const totalPublications = await Publication.countDocuments(filtro);

    // Si no hay publicaciones, devolvemos 200 con array vacío (es un flujo correcto)
    if (totalPublications < 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        page: Number(page),
        totalPages: 0,
        message: "No hay publicaciones disponibles para esta consulta",
        data: [],
      });
    }

    // Buscamos la data paginada y ordenada
    const publications = await Publication.find(filtro)
      .sort({ createdAt: -1 })
      .populate("publicador", "nombre")
      .populate("materia", "nombre")
      .skip((Number(page) - 1) * Number(limit)) // Aseguramos que operen como números
      .limit(Number(limit));

    // Mandando la data con el conteo real
    res.status(200).json({
      success: true,
      count: publications.length,
      page: Number(page),
      totalPages: Math.ceil(totalPublications / Number(limit)),
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

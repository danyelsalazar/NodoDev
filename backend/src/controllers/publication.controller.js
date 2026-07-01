import { Publication } from "../models/PublicationModel.js";
import { Subject } from "../models/SubjectModel.js";
import { User } from "../models/UserModel.js";
import { AppError } from "../utils/AppError.js";

//crear publicacion
const createPublication = async (req, res, next) => {
  try {
    const data = req.body;
    const idPublicador = req.user.id;

    // Verifico que el usuario exista en la BD
    const exist = await User.findById(idPublicador);

    if (!exist) {
      return next(new AppError("El usuario no existe en la base de datos",404))
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
    next(error)
  }
};

//traer publicaciones
const getPublications = async (req, res, next) => {
  try {
    const { page, limit, materia, tipo } = req.query;
    let filtro = {};

    // filtro de materia es independiente
    if (materia) {
      const materiaEncontrada = await Subject.findOne({
        nombre: { $regex: materia, $options: "i" },
      });

      // Si la materia que busca el usuario no existe
      if (!materiaEncontrada) {
        return res.status(200).json({
          success: true,
          count: 0,
          page,
          totalPages: 0,
          message: `La materia '${materia}' no existe en la BD`,
          data: [],
        });
      }

      // Si existe, agregamos su id al filtro
      filtro.materia = materiaEncontrada._id;
    }

    // FILTRO DE TIPO: También es independiente y se acumula si ya existe la materia
    if (tipo) {
      filtro.tipo = tipo;
    }

    // A partir de aqui, filtro puede contener:
    // {} (trae todo)
    // { materia: ID } (solo materia)
    // { tipo: "RECURSO" } (solo tipo)
    // { materia: ID, tipo: "RECURSO" } (ambos al mismo tiempo)

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
    next(error)
  }
};

export { createPublication, getPublications };

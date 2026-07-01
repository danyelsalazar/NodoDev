import { Subject } from "../models/SubjectModel.js";
import { AppError } from "../utils/AppError.js";

const crearSubject = async (req, res, next) => {
  try {
    const datosSubject = req.body; // Ya validados, limpios y con .trim() aplicados por tu middleware de Zod

    // Busco la materia en la base de datos para verificar que no exista ya
    const exist = await Subject.findOne({ nombre: datosSubject.nombre });

    if (exist) {
      return next(
        new AppError("La materia ya está registrada en el sistema", 409),
      );
    }

    // Si no está registrada, la creamos 
    const newSubject = await Subject.create(datosSubject);

    res.status(201).json({
      success: true, 
      data: {
        id: newSubject._id,
        nombre: newSubject.nombre,
        carreras: newSubject.carreras,
      },
      message: "Materia creada exitosamente", 
    });
  } catch (error) {
    next(error);
  }
};

export { crearSubject };

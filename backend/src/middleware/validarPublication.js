import { z } from "zod";
import { TYPES } from "../constants/typePublication.js";

// para validar que los ID de usuario coincidan con la estructura de ids de mongo
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "El ID enviado no es un formato de MongoDB válido");

//reglas para la CREACIÓN de una publicación
const createPublicationSchema = z.object({
  descripcion: z
    .string({ required_error: "Se debe enviar una descripcion en la publicacion" })
    .trim()
    .min(1, "Se debe enviar una descripcion en la publicacion"),

  materia: objectIdSchema
    .optional(),

  tipo: z
    .nativeEnum(TYPES, {
      errorMap: () => ({
        message: `El tipo de publicación no es válido. Opciones: ${Object.values(TYPES).join(", ")}`,
      }),
    }),
});

const validarCrearPublicacion = function (req, res, next) {
  // Analizamos los datos del cuerpo de la petición
  const validacion = createPublicationSchema.safeParse(req.body);

  // Si la validación falla
  if (!validacion.success) {
    const erroresZod = validacion.error.issues || validacion.error.errors || [];

    // Formateamos con estructura limpia
    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Datos de publicación inválidos",
      detalles: erroresFormateados,
    });
  }

  // Si todo está bien, pasamos los datos limpios y avanzamos
  req.body = validacion.data;
  next();
};

export { validarCrearPublicacion };

import { z } from "zod";
import { TYPES } from "../constants/typePublication.js";

// Validador estricto para IDs de MongoDB
const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "El ID de la materia no es un formato de MongoDB válido",
  );

// Reglas para la CREACIÓN de una publicación
const createPublicationSchema = z.object({
  descripcion: z
    .string({
      required_error: "Se debe enviar una descripcion en la publicacion",
    })
    .trim()
    .min(1, "Se debe enviar una descripcion en la publicacion"),

  // Si envían algo en 'materia', forzamos a que cumpla estrictamente el formato de ID de Mongo
  materia: objectIdSchema.optional().or(z.literal("")), // Permite opcional o un string vacío limpio

  tipo: z.nativeEnum(TYPES, {
    errorMap: () => ({
      message: `El tipo de publicación no es válido. Opciones: ${Object.values(TYPES).join(", ")}`,
    }),
  }),
});

const validarCrearPublicacion = function (req, res, next) {
  const validacion = createPublicationSchema.safeParse(req.body);

  if (!validacion.success) {
    const erroresZod = validacion.error.issues || [];

    const erroresFormateados = erroresZod.map((err) => ({
      // Extrae el nombre del campo exacto que falló (ej: "materia")
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Datos de publicación inválidos",
      detalles: erroresFormateados,
    });
  }

  // Si todo está bien, reemplazamos el body con los datos limpios de Zod
  req.body = validacion.data;
  next();
};

export { validarCrearPublicacion };

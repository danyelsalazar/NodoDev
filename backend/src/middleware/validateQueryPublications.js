import { z } from "zod";
import { TYPES } from "../constants/typePublication.js";

const queryPublicationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  materia: z.string().trim().optional(), // Filtro de texto para buscar por nombre de materia
  tipo: z
    .nativeEnum(TYPES, {
      errorMap: () => ({
        message: `El tipo de filtrado no es válido. Opciones: ${Object.values(TYPES).join(", ")}`,
      }),
    })
    .optional(),
});

export const validarQueryPublicaciones = (req, res, next) => {
  const validacion = queryPublicationSchema.safeParse(req.query);

  if (!validacion.success) {
    const erroresZod = validacion.error.issues || [];
    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Parámetros de filtrado de publicaciones inválidos",
      detalles: erroresFormateados,
    });
  }

  req.query = validacion.data;
  next();
};

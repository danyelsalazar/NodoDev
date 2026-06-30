import { z } from "zod";
import { ROLES } from "../constants/roles.js";
import { TYPES } from "../constants/typePublication.js";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "El ID de la materia no es un formato válido");

const queryUserSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  nombre: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("El formato del email no es válido")
    .optional(),
  carrera: z.string().trim().optional(),

  materias: z
    .preprocess((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    }, z.array(objectIdSchema))
    .optional(),

  // Aquí está el campo validado correctamente contra tu Enum/Objeto de roles
  role: z
    .nativeEnum(ROLES, {
      errorMap: () => ({
        message: `El rol de filtrado no es válido. Opciones: ${Object.values(ROLES).join(", ")}`,
      }),
    })
    .optional(),
  tipo: z
    .nativeEnum(TYPES, {
      errorMap: () => ({
        message: `El tipo de filtrado no es válido. Opciones: ${Object.values(TYPES).join(", ")}`,
      }),
    })
    .optional(),
});

export const validarQueryUsuarios = (req, res, next) => {
  const validacion = queryUserSchema.safeParse(req.query);

  if (!validacion.success) {
    const erroresZod = validacion.error.issues || validacion.error.errors || [];
    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Parámetros de filtrado de usuarios inválidos",
      detalles: erroresFormateados,
    });
  }

  // Sobreescribimos req.query con los datos limpios, incluyendo el 'role' si venía
  req.query = validacion.data;
  next();
};

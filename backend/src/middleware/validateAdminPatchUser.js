import { z } from "zod";
import { ROLES } from "../constants/roles.js";
import { registroSchema } from "./validarRegistroMiddleware.js"; 

// Reutilizamos el squema de registro original para el PATCH de administración
const adminPatchUserSchema = registroSchema
  .omit({ password: true}) // Quitamos password por seguridad
  .partial() // convierte automáticamente nombre, email y materias en opcionales
  .extend({
    // Agregamos únicamente el campo 'role' controlado por las constantes 
    role: z
      .nativeEnum(ROLES, {
        errorMap: () => ({
          message: `El rol no es válido. Opciones: ${Object.values(ROLES).join(", ")}`,
        }),
      })
      .optional(),
  });

const validarAdminPatchUser = function (req, res, next) {
  const validacion = adminPatchUserSchema.safeParse(req.body);

  if (!validacion.success) {
    const erroresZod = validacion.error.issues || validacion.error.errors || [];

    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Datos de actualización inválidos",
      detalles: erroresFormateados,
    });
  }

  // Guardo los datos limpios en req.body y avanzo al controlador
  req.body = validacion.data;
  next();
};

export { validarAdminPatchUser };

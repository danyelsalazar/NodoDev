import { z } from "zod";

// esquema de validacion
const registroSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El formato del email no es válido"),

  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número")
    .regex(
      /[@$!%*?&_#.-]/,
      "La contraseña debe tener al menos un carácter especial (ej: @, $, !, %, *)",
    ),

  // Campos opcionales
  materias: z.array(z.string()).optional(),
  carrera: z.string().optional(),
});

const validarRegistro = function (req, res, next) {
  // safeParse analiza los datos que vienen en el cuerpo de la petición (req.body)
  const validacion = registroSchema.safeParse(req.body);

  // Si la validación falla
  if (!validacion.success) {
    //Usamos .issues que es la propiedad nativa de Zod y un respaldo por si acaso
    const erroresZod = validacion.error.issues || validacion.error.errors || [];

    // Formateamos asegurando que path[0] no rompa el código si viene vacío
    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Datos de registro inválidos",
      detalles: erroresFormateados,
    });
  }

  // Si todo esta bien, reemplazamos req.body con los datos ya limpios y validados por Zod
  req.body = validacion.data;
  next(); // Continuamos al controlador
};

export { validarRegistro };

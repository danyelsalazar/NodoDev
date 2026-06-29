import { z } from "zod";
// Validar que un string tenga el formato exacto de un ObjectId de MongoDB, asi se lo paso en materias para estar seguro que esta enviando un id correcto
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "El ID de la materia no es válido");

// Definimos las reglas para modificacion de datos del usaurio , puede modificar todo menos su password aqui
const patchUserSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .optional(),

  email: z.string().email("El formato del email no es válido").optional(),

  materias: z
    .array(objectIdSchema, {
      invalid_type_error: "El campo materias debe ser un arreglo de ids",
    })
    .min(1, "Debes seleccionar al menos una materia")
    .optional(),
  carrera: z.string().optional(),
});

const validarPatchUser = function (req, res, next) {
  // safeParse analiza los datos que vienen en el cuerpo de la petición (req.body)
  const validacion = patchUserSchema.safeParse(req.body);

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

export { validarPatchUser };

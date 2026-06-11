import { z } from "zod";

// Definimos las reglas para el registro de usuario
const creacionSubjectSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(5, "El nombre debe tener al menos 5 caracteres"),
  carreras: z.array(
    z.enum(
      [
        "Ingenieria en Sistemas",
        "Licenciatura en Informatica",
        "Tecnicatura en tecnologias web",
        "Tecnicatura en redes Informaticas",
        "Tecnicatura en analista de sistemas",
      ],
      {
        invalid_type_error: "El nombre de la carrera es obligatorio y debe coincidir con las carreras disponibles: Ingenieria en Sistemas | Licenciatura en Informatica | Tecnicatura en tecnologias web | Tecnicatura en redes Informaticas | Tecnicatura en analista de sistemas"
      }
    )
  )
  .min(1, "Debes indicar al menos una carrera")
});

const validarSubject= function (req, res, next) {
  // safeParse analiza los datos que vienen en el cuerpo de la petición (req.body)
  const validacion = creacionSubjectSchema.safeParse(req.body);

  // Si la validación falla
  if (!validacion.success) {
    //Usamos .issues que es la propiedad nativa de Zod y un respaldo por si acaso
    const erroresZod = validacion.error.issues || validacion.error.errors || [];

    // Formateamos asegurando que path[0] no rompa el codigo si viene vacío
    const erroresFormateados = erroresZod.map((err) => ({
      campo: err.path && err.path.length > 0 ? err.path[0] : "general",
      mensaje: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Datos de materia incorrectos",
      detalles: erroresFormateados,
    });
  }

  // Si todo esta bien, reemplazamos req.body con los datos ya limpios y validados por Zod
  req.body = validacion.data;
  next(); // Continuamos al controlador
};

export  {validarSubject}
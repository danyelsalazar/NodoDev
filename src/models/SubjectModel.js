import mongoose, { Schema } from "mongoose";

// cremaos nuestro esquema de materias
const subjectSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
    trim: true,
  },
  carreras: {
    type: [
      {
        type: String,
        enum: {
          values: [
            "Ingenieria en Sistemas",
            "Licencenciatura en Informatica",
            "Tecnicatura en tecnologias web",
            "Tecnicatura en redes Informaticas",
            "Tecnicatura en analista de sistemas",
          ],
          message: "{VALUE} no es una carrera válida",
        },
      },
    ],
    required:[true, 'La meteria debe tener al menos una carrea a la que pertenece']
  },
});

// ceeo el modelo para exportar
const Subject = mongoose.model("Subject", subjectSchema);

export { Subject };

import mongoose, { Schema } from "mongoose";

// cremaos nuestro esquema de materias
const subjectSchema = new Schema(
  {
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
          enum: [
            "Ingenieria en Sistemas",
            "Licenciatura en Informatica",
            "Tecnicatura en tecnologias web",
            "Tecnicatura en redes Informaticas",
            "Tecnicatura en analista de sistemas",
          ],
        },
      ],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Debe tener al menos una carrera",
      },
    },
  },
  { timestamps: true },
);

// ceeo el modelo para exportar
const Subject = mongoose.model("Subject", subjectSchema);

export { Subject };

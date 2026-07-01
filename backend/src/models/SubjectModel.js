import mongoose, { Schema } from "mongoose";
import { CARRERAS } from "../constants/carreras.js";

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
          enum: Object.values(CARRERAS),
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

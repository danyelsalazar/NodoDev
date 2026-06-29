import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { ROLES } from "../constants/roles.js";

const userSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, ingresa un correo válido",
    ],
  },
  password: {
    type: String,
    required: [true, "La contrasena es obligatoria"],
    validate: {
      // valido que la contrasena cumpla con mayuscula, minuscual, numero y caracter especial
      validator: function (valor) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          valor,
        );
      },
      message:
        "La contrasena debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)",
    },
  },
  publicaciones: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publication",
      },
    ],
    default: [],
  },
  materias: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
  },
});

// uso el metodo pre de mongo para crear un hook que va a  hashear la password antes de guardarla en la bd
//uso function y no ()=> porque necesito usar this para hacer referencia a las propiedades que defini del schema
userSchema.pre("save", async function () {
  // Si la contraseña no se modificó, simplemente salimos de la función)
  if (!this.isModified("password")) return;

  try {
    // Reemplazamos el texto plano por el hash seguro
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model("User", userSchema);
export { User };

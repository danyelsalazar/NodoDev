import mongoose, { Schema } from "mongoose";

const publicationSchema = new Schema({
  publicador: {
    type: mongoose.Schema.Types.ObjectId, // Guarda el ID del usuario
    ref: "Usuario", // nombre del modelo al que hace referencia
    required: [true, "Es requerido el publicador"],
  },
  likers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    default: [],
  },
  fecha_publicacion: {
    type: Date,
    default: Date.now, //crea una fecha automatica en el momento que hagan una publicacion
  },
});

//creamos el modelo para luego exportarlo
const Publication = mongoose.model("Publication", publicationSchema);

export { Publication };

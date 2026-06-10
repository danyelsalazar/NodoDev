import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        nombre:{
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        email:{
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingresa un correo válido']
        },
        password:{
            type: String,
            required:[true, 'La contrasena es obligatoria'],
            validate:{
                // valido que la contrasena cumpla con mayuscula, minuscual, numero y caracter especial
                validator: function(valor){
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(valor)
                } 
            },
            message: 'La contrasena debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
        },
        publicaciones:{
            type:[{
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Publication"
            }],
            default: []
        },
        materias:{
            type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject"
            }],
            default: []
        }
    }
)
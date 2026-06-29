import mongoose from "mongoose"

// nos conectamos a la base de datos
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo conectado!!");
        
    } catch (error) {
        console.log("No se pudo conectar a Mongo: " , error);
        
    }
}

export default connectDB
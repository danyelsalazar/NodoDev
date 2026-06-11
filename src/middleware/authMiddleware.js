import jwt from "jsonwebtoken";
import { success } from "zod";

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //obtengo el token
  const token = authHeader && authHeader.split(" ")[1];

  //verico que haya enviado el token
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no enviado",
    });
  //verifcpo que el token pertenece al servidor
  try{
    // verifico si es valido , si no lo es salta al catch
    const verificado = jwt.verify(token, process.env.JWT_SECRET)
    // creo la propiedad user a req para guardar los datos del usuario y usarla en los controllers
    req.user = verificado
    next() //continuo hacia la ruta
  }catch(eror){
    res.status(403).json({
        success: false,
        error: "Token invalido o expirado"
    })
  }
};
export {verificarToken}
//creo un middleware que va a obtener el rol del usaurio para asi luego usarlo en las rutas y de esta manera podre tener rutas para cada rol USER y ADMIN 
export const allowRoles = (...roles)=>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            res.status(403).json({
                succes: false,
                message: "No autorizado"
            })
        }
        next()
    }
}
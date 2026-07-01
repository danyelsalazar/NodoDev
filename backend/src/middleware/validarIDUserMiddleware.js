const validarParamId = (req, res, next) => {
  const { id } = req.params;
  // Valida si el formato del parámetro 'id' coincide con un ObjectId de MongoDB
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message:
        "El ID enviado en la URL no tiene un formato válido de base de datos",
    });
  }
  next();
};

export { validarParamId };

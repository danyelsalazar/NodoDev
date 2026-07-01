export const errorHandler = (err, req, res, next) => {
  // Si el error es nuestro usa su propio status, si es un error raro de Node usa 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Formato estandarizado de respuesta para toda la API
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // El stack trace (línea exacta del error) solo se muestra si estamos programando localmente
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

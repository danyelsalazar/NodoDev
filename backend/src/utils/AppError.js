class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Si el estado empieza con 4 (400, 404), es un fallo del cliente, si no, es un error 500 del servidor
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Nos ayuda a saber que es un error controlado por nosotros
  }
}

export { AppError };

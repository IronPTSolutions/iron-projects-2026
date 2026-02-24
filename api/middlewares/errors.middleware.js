/**
 * Middleware centralizado de manejo de errores.
 * Captura todos los errores lanzados en la aplicación y devuelve
 * respuestas JSON con el código HTTP apropiado.
 */
export function errorHandler(err, req, res, next) {
  // Error de validación de Mongoose (campos requeridos, formatos inválidos, etc.)
  if (err.name === "ValidationError") {
    res.status(400).json(err.errors);
    return;
  }

  // Errores HTTP creados con http-errors (ej: createHttpError(401, "unauthorized"))
  if (err.status) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Error de cast de Mongoose (ej: ObjectId inválido en un parámetro de URL)
  if (err.name === "CastError") {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  // Error de duplicado de MongoDB (ej: email ya registrado, índice único violado)
  if (err.message?.includes("E11000")) {
    res.status(409).json({ message: "Resource already exist" });
    return;
  }

  // Error inesperado: se registra en consola y se devuelve un error genérico 500
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

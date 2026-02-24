/**
 * Middleware de limpieza del body.
 * Elimina campos protegidos del cuerpo de la petición para evitar
 * que el cliente pueda manipular valores gestionados por el servidor.
 */
export function clearBody(req, res, next) {
  delete req.body?.createdAt; // Gestionado automáticamente por Mongoose (timestamps)
  delete req.body?.updatedAt; // Gestionado automáticamente por Mongoose (timestamps)
  delete req.body?._id; // El id lo genera MongoDB automáticamente

  next();
}

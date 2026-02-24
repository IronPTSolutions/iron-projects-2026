import createError from "http-errors";
import Session from "../models/session.model.js";

/**
 * Middleware de autenticación.
 * Verifica que cada petición tenga una cookie de sesión válida.
 * Si la sesión es válida, adjunta los datos de la sesión y del usuario a req.session.
 */
export async function checkAuth(req, res, next) {
  // Rutas públicas: registro de usuario (no requiere autenticación)
  if (req.method === "POST" && req.path === "/api/users") {
    next();
    return;
  }

  // Rutas públicas: inicio de sesión (no requiere autenticación)
  if (req.method === "POST" && req.path === "/api/sessions") {
    next();
    return;
  }

  // Extrae el sessionId de la cookie usando una expresión regular
  const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];

  // Si no hay cookie de sesión, la petición no está autenticada
  if (!sessionId) {
    throw createError(401, "unauthorized");
  }

  // Busca la sesión en la base de datos y popula los datos del usuario
  const session = await Session.findById(sessionId).populate("user");

  // Si la sesión no existe (expirada o inválida), rechaza la petición
  if (!session) {
    throw createError(401, "unauthorized");
  }

  // Adjunta la sesión (con el usuario populado) al objeto request
  // Los controladores pueden acceder al usuario con req.session.user
  req.session = session;

  next();
}

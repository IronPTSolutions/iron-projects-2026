import { Router } from "express";
import createHttpError from "http-errors";
// Importa todos los controladores de usuarios y proyectos
import * as users from "../controllers/users.controller.js";
import * as projects from "../controllers/projects.controller.js";

import upload from "../config/multer.config.js"; // Configuración de Multer para manejo de archivos

// Crea una instancia del enrutador de Express
const router = Router();

// --- Rutas de autenticación ---
router.post("/users", users.create); // Registro de nuevo usuario (requiere código de invitación)
router.post("/sessions", users.login); // Inicio de sesión (crea cookie de sesión)
router.delete("/sessions", users.logout); // Cierre de sesión (elimina la sesión)

// --- Rutas de usuarios ---
router.patch("/users/me", upload.single("avatar"), users.update); // Actualizar perfil del usuario autenticado
router.get("/users/:id", users.detail); // Obtener perfil de un usuario (acepta "me" como id)

// --- Rutas de proyectos ---
router.post("/projects", projects.create); // Crear un nuevo proyecto
router.get("/projects", projects.list); // Listar proyectos (con filtros opcionales: module, promotion, author)
router.get("/projects/:id", projects.detail); // Obtener detalle de un proyecto con sus reviews
router.patch("/projects/:id", projects.update); // Actualizar un proyecto (solo el autor)
router.delete("/projects/:id", projects.destroy); // Eliminar un proyecto (solo el autor)

// --- Rutas de reviews (anidadas bajo proyectos) ---
router.post("/projects/:id/reviews", projects.createReview); // Crear una review en un proyecto
router.delete("/projects/:id/reviews/:reviewId", projects.deleteReview); // Eliminar una review (solo el autor)

// --- Rutas de mensajes (anidadas bajo usuarios) ---
router.post("/users/:id/messages", users.createMessage); // Enviar un mensaje a un usuario
router.delete("/users/:id/messages/:messageId", users.destroyMessage); // Eliminar un mensaje no leído

// Middleware catch-all: cualquier ruta no definida devuelve un error 404
router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;

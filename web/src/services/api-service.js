import axios from "axios";

/**
 * Cliente HTTP configurado con Axios.
 *
 * - baseURL: apunta al backend en localhost:3000/api.
 * - withCredentials: envía cookies de sesión en cada petición (necesario para auth).
 */
const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

/**
 * Interceptor de respuestas:
 * - En caso de éxito: devuelve directamente response.data (desenvuelve la respuesta).
 * - En caso de error: rechaza la promesa para que se maneje en el catch del llamador.
 */
http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

// ─── Autenticación ──────────────────────────────────────────────

/** Registra un nuevo usuario. */
export function register(user) {
  return http.post("/users", user);
}

/** Inicia sesión (crea una sesión en el servidor). */
export function login(email, password) {
  return http.post("/sessions", { email, password });
}

/** Cierra la sesión activa (elimina la sesión del servidor). */
export function logout() {
  return http.delete("/sessions");
}

// ─── Usuarios ───────────────────────────────────────────────────

/** Obtiene el perfil del usuario autenticado. */
export function getProfile() {
  return http.get("/users/me");
}

/** Actualiza el perfil del usuario autenticado. */
export function updateProfile(data) {
  return http.patch("/users/me", data);
}

/** Obtiene un usuario por su ID. */
export function getUser(id) {
  return http.get(`/users/${id}`);
}

// ─── Proyectos ──────────────────────────────────────────────────

/** Crea un nuevo proyecto. */
export function createProject(project) {
  return http.post("/projects", project);
}

/** Lista proyectos, opcionalmente filtrados por query params. */
export function listProjects(filters) {
  return http.get("/projects", { params: filters });
}

/** Obtiene un proyecto por su ID. */
export function getProject(id) {
  return http.get(`/projects/${id}`);
}

/** Actualiza parcialmente un proyecto. */
export function updateProject(id, data) {
  return http.patch(`/projects/${id}`, data);
}

/** Elimina un proyecto. */
export function deleteProject(id) {
  return http.delete(`/projects/${id}`);
}

// ─── Reviews ────────────────────────────────────────────────────

/** Crea una review en un proyecto. */
export function createReview(projectId, review) {
  return http.post(`/projects/${projectId}/reviews`, review);
}

/** Elimina una review de un proyecto. */
export function deleteReview(projectId, reviewId) {
  return http.delete(`/projects/${projectId}/reviews/${reviewId}`);
}

// ─── Mensajes ───────────────────────────────────────────────────

/** Envía un mensaje a un usuario. */
export function sendMessage(userId, message) {
  return http.post(`/users/${userId}/messages`, message);
}

/** Elimina un mensaje de una conversación. */
export function deleteMessage(userId, messageId) {
  return http.delete(`/users/${userId}/messages/${messageId}`);
}

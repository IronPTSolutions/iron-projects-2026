// Importa el modelo Message para registrarlo en Mongoose (necesario para los populate)
import "../models/message.model.js";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import Message from "../models/message.model.js";
import createHttpError from "http-errors";

/**
 * Registro de un nuevo usuario.
 * Valida el código de invitación antes de crear el usuario.
 * Ruta: POST /api/users
 */
export async function create(req, res) {
  // Obtiene los códigos de invitación válidos desde las variables de entorno
  const inviteCodes = process.env.VALID_INVITE_CODES?.split(",") || [];

  // Verifica que el código de invitación proporcionado sea válido
  if (!inviteCodes.includes(req.body.inviteCode)) {
    throw createHttpError(400, "invalid invite code");
  }

  // Crea el usuario en la base de datos (la contraseña se hashea automáticamente en el pre-save)
  const user = await User.create(req.body);

  res.json(user);
}

/**
 * Actualiza el perfil del usuario autenticado.
 * Ruta: PATCH /api/users/me
 */
export async function update(req, res) {
  // Asigna los campos del body al usuario de la sesión actual
  delete req.body.email;

  Object.assign(req.session.user, req.body);

  if (req.file) {
    req.session.user.avatarUrl = req.file.path; // La URL del avatar se obtiene del path del archivo subido por Multer
  }

  // Guarda los cambios en la base de datos
  await req.session.user.save();
  res.json(req.session.user);
}

/**
 * Envía un mensaje privado a otro usuario.
 * Ruta: POST /api/users/:id/messages
 */
export async function createMessage(req, res) {
  // Crea el mensaje asignando automáticamente el remitente (usuario autenticado)
  // y el destinatario (id de la URL)
  const message = await Message.create({
    ...req.body,
    sender: req.session.user.id,
    receiver: req.params.id,
    read: false,
  });

  res.json(message);
}

/**
 * Elimina un mensaje no leído.
 * Solo el destinatario puede eliminar mensajes que aún no ha leído.
 * Ruta: DELETE /api/users/:id/messages/:messageId
 */
export async function destroyMessage(req, res) {
  // Busca el mensaje verificando que pertenece al destinatario y no ha sido leído
  const message = Message.findOne({
    _id: req.params.messageId,
    receiver: req.params.id,
    read: false,
    author: req.session.user.id,
  });

  if (!message) {
    throw createHttpError(404, "Message not found");
  }

  // Elimina el mensaje de la base de datos
  await Message.findByIdAndDelete(message.id);

  // Responde con 204 (sin contenido) indicando que se eliminó correctamente
  res.status(204).send();
}

/**
 * Obtiene el perfil de un usuario con sus proyectos.
 * Si el usuario consulta su propio perfil, también incluye sus mensajes.
 * Ruta: GET /api/users/:id (acepta "me" como alias del usuario autenticado)
 */
export async function detail(req, res) {
  // Si el parámetro es "me", usa el id del usuario autenticado
  const id = req.params.id === "me" ? req.session.user.id : req.params.id;

  // Busca el usuario y popula sus proyectos
  let userPromise = User.findById(id).populate("projects");

  // Si es el propio perfil, también popula los mensajes enviados y recibidos
  if (id === req.session.user.id) {
    userPromise = userPromise.populate("sentMessages receivedMessages");
  }

  const user = await userPromise;

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.json(user);
}

/**
 * Inicio de sesión del usuario.
 * Verifica credenciales, crea una sesión en BD y envía una cookie httpOnly.
 * Ruta: POST /api/sessions
 */
export async function login(req, res) {
  const { email, password } = req.body;

  // Valida que se proporcionaron email y contraseña
  if (!email || !password) {
    throw createHttpError(400, "missing email or password");
  }

  // Busca el usuario por email
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, "user not found");
  }

  // Verifica la contraseña usando bcrypt
  const match = await user.checkPassword(password);

  if (!match) {
    throw createHttpError(401, "invalid password");
  }

  // Crea un documento de sesión en la base de datos
  const session = await Session.create({ user: user.id });

  // Envía la cookie de sesión al cliente
  // httpOnly: no accesible desde JavaScript del navegador (protección contra XSS)
  // secure: solo se envía por HTTPS cuando está habilitado
  res.cookie("sessionId", session.id, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
  });

  res.json(user);
}

/**
 * Cierre de sesión del usuario.
 * Elimina el documento de sesión de la base de datos.
 * Ruta: DELETE /api/sessions
 */
export async function logout(req, res) {
  // Elimina la sesión actual de la base de datos
  await Session.findByIdAndDelete(req.session.id);

  // Responde con 204 (sin contenido)
  res.status(204).end();
}

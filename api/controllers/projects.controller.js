import createHttpError from "http-errors";
import Review from "../models/review.model.js";
import Project from "../models/project.model.js";

/**
 * Crea un nuevo proyecto.
 * Asigna automáticamente el autor y la promoción del usuario autenticado.
 * Ruta: POST /api/projects
 */
export async function create(req, res) {
  const project = await Project.create({
    ...req.body,
    promotion: req.session.user.promotion, // Hereda la promoción del usuario
    author: req.session.user.id, // Asigna el autor automáticamente
  });

  res.json(project);
}

/**
 * Lista proyectos con filtros opcionales.
 * Query params: module (1, 2 o 3), promotion (XX.YYYY), author (ObjectId)
 * Ruta: GET /api/projects
 */
export async function list(req, res) {
  // Construye los criterios de búsqueda dinámicamente según los query params
  const criteria = {};

  if (req.query.module) {
    criteria.module = req.query.module;
  }

  if (req.query.promotion) {
    criteria.promotion = req.query.promotion;
  }

  if (req.query.author) {
    criteria.author = req.query.author;
  }

  // Busca los proyectos que coincidan con los criterios
  const projects = await Project.find(criteria);

  res.json(projects);
}

/**
 * Obtiene el detalle de un proyecto con sus reviews y los autores de cada review.
 * Ruta: GET /api/projects/:id
 */
export async function detail(req, res) {
  // Busca el proyecto y popula las reviews con los datos del autor de cada una
  const project = await Project.findById(req.params.id).populate({
    path: "reviews",
    populate: "author", // Populate anidado: obtiene los datos del autor de cada review
  });

  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  res.json(project);
}

/**
 * Actualiza un proyecto existente.
 * No permite cambiar el campo "author" por seguridad.
 * Ruta: PATCH /api/projects/:id
 */
export async function update(req, res) {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  // Elimina el campo author del body para evitar que se reasigne el proyecto
  delete req.body.author;
  // Aplica los cambios al documento
  Object.assign(project, req.body);

  // Guarda y ejecuta las validaciones de Mongoose
  await project.save();

  res.json(project);
}

/**
 * Elimina un proyecto.
 * Solo el autor del proyecto puede eliminarlo.
 * Ruta: DELETE /api/projects/:id
 */
export async function destroy(req, res) {
  const project = await Project.findById(req.params.id);

  // Verifica que el usuario autenticado sea el autor del proyecto
  if (project.author.toString() !== req.session.user.id.toString()) {
    throw createHttpError(403, "Not your project");
  }

  await Project.findByIdAndDelete(project.id);

  // 204: operación exitosa sin contenido en la respuesta
  res.status(204).end();
}

/**
 * Crea una review en un proyecto.
 * Asigna automáticamente el autor (usuario autenticado) y el proyecto (URL param).
 * Ruta: POST /api/projects/:id/reviews
 */
export async function createReview(req, res) {
  const review = await Review.create({
    ...req.body,
    author: req.session.user.id, // El autor es el usuario autenticado
    project: req.params.id, // El proyecto viene del parámetro de la URL
  });

  res.json(review);
}

/**
 * Elimina una review de un proyecto.
 * Solo el autor de la review puede eliminarla.
 * Ruta: DELETE /api/projects/:id/reviews/:reviewId
 */
export async function deleteReview(req, res) {
  // Busca la review verificando que pertenece al proyecto indicado
  const review = await Review.findOne({
    _id: req.params.reviewId,
    project: req.params.id,
  });

  // Verifica que el usuario autenticado sea el autor de la review
  if (review.author.toString() !== req.session.user.id.toString()) {
    throw createHttpError(403, "Not your review");
  }

  await Review.findByIdAndDelete(review.id);

  res.status(204).end();
}

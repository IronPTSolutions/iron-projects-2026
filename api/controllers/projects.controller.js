import createHttpError from "http-errors";
import Review from "../models/review.model.js";
import Project from "../models/project.model.js";

export async function create(req, res) {
  const project = await Project.create({
    ...req.body,
    promotion: req.session.user.promotion,
    author: req.session.user.id,
  });

  res.json(project);
}

export async function list(req, res) {
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

  const projects = await Project.find(criteria);

  res.json(projects);
}

export async function detail(req, res) {
  const project = await Project.findById(req.params.id).populate({
    path: "reviews",
    populate: "author",
  });

  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  res.json(project);
}

export async function update(req, res) {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  delete req.body.author;
  Object.assign(project, req.body);

  await project.save();

  res.json(project);
}

export async function destroy(req, res) {
  const project = await Project.findOne(req.params.id);

  if (project.author.toString() !== req.session.user.id.toString()) {
    throw createHttpError(403, "Not your project");
  }

  await Project.findByIdAndDelete(project.id);

  res.status(204).end();
}

export async function createReview(req, res) {
  const review = await Review.create({
    ...req.body,
    author: req.session.user.id,
    project: req.params.id,
  });

  res.json(review);
}

export async function deleteReview(req, res) {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    project: req.params.id,
  });

  if (review.author.toString() !== req.session.user.id.toString()) {
    throw createHttpError(403, "Not your review");
  }

  await Review.findByIdAndDelete(review.id);

  res.status(204).end();
}

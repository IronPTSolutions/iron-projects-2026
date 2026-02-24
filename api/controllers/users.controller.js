import "../models/message.model.js";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import Message from "../models/message.model.js";
import createHttpError from "http-errors";

export async function create(req, res) {
  const user = await User.create(req.body);
  res.json(user);
}

export async function update(req, res) {
  Object.assign(req.session.user, req.body);
  await req.session.user.save();
  res.json(req.session.user);
}

export async function createMessage(req, res) {
  const message = await Message.create({
    ...req.body,
    sender: req.session.user.id,
    receiver: req.params.id,
    read: false,
  });

  res.json(message);
}

export async function destroyMessage(req, res) {
  const message = Message.findOne({
    _id: req.params.messageId,
    receiver: req.params.id,
    read: false,
    author: req.session.user.id,
  });

  if (!message) {
    throw createHttpError(404, "Message not found");
  }

  await Message.findByIdAndDelete(message.id);

  res.status(204).send();
}

export async function detail(req, res) {
  const id = req.params.id === "me" ? req.session.user.id : req.params.id;

  let userPromise = User.findById(id).populate("projects");

  if (id === req.session.user.id) {
    userPromise = userPromise.populate("sentMessages receivedMessages");
  }

  const user = await userPromise;

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.json(user);
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, "missing email or password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, "user not found");
  }

  const match = await user.checkPassword(password);

  if (!match) {
    throw createHttpError(401, "invalid password");
  }

  const session = await Session.create({ user: user.id });

  res.cookie("sessionId", session.id, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
  });

  res.json(user);
}

export async function logout(req, res) {
  await Session.findByIdAndDelete(req.session.id);

  res.status(204).end();
}

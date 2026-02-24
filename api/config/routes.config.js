import { Router } from "express";
import createHttpError from "http-errors";
import * as users from "../controllers/users.controller.js";
import * as projects from "../controllers/projects.controller.js";

const router = Router();

router.post("/users", users.create);
router.post("/sessions", users.login);
router.delete("/sessions", users.logout);
router.patch("/users/me", users.update);
router.get("/users/:id", users.detail);
router.post("/projects", projects.create);
router.get("/projects", projects.list);
router.get("/projects/:id", projects.detail);
router.patch("/projects/:id", projects.update);
router.delete("/projects/:id", projects.destroy);

router.post("/projects/:id/reviews", projects.createReview);
router.delete("/projects/:id/reviews/:reviewId", projects.deleteReview);

router.post("/users/:id/messages", users.createMessage);
router.delete("/users/:id/messages/:messageId", users.destroyMessage);

router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;

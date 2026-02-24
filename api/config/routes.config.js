import { Router } from "express";
import createHttpError from "http-errors";

const router = Router();

router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;

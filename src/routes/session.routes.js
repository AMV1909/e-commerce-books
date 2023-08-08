import { Router } from "express";
import { login, register } from "../controllers/session.controllers.js";

const router = Router();

router.post("/users/login", login);
router.post("/users/register", register);

export { router as sessionRoutes };

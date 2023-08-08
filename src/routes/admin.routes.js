import { Router } from "express";
import { verifyToken } from "../jwt/jwt.js";
import { checkAdmin } from "../authentication/checkadmin.js";
import { createAdmin, deleteAdmin } from "../controllers/admin.controllers.js";

const router = Router();

// We need to add the verifyToken middleware to all the routes
// With that, we can check if the user is an admin or not
// Only admins can create, update and delete admins

router.post("/admins", verifyToken, createAdmin);

router.delete("/admins/:id", verifyToken, checkAdmin, deleteAdmin);

export { router as adminRoutes };

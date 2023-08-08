import { Router } from "express";
import { verifyToken } from "../jwt/jwt.js";
import {
    updateAddress,
    updateProfilePicture,
} from "../controllers/user.controllers.js";

const router = Router();

// The user should be logged in to update their address or profile picture
// That's why we need to add the verifyToken middleware

router.put("/users/updateAddress", verifyToken, updateAddress);
router.put("/users/updateProfilePicture", verifyToken, updateProfilePicture);

export { router as userRoutes };

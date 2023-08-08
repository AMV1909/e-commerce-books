import { Router } from "express";
import { verifyToken } from "../jwt/jwt.js";
import { checkAdmin } from "../authentication/checkadmin.js";
import {
    getSales,
    buyProduct,
    buyCartProducts,
} from "../controllers/buy.controllers.js";

const router = Router();

// Sales route is only for admins
// That information should not be public
router.get("/sales", verifyToken, checkAdmin, getSales);

router.post("/buy", verifyToken, buyProduct);
router.post("/buy/cart", verifyToken, buyCartProducts);

export { router as buyRoutes };

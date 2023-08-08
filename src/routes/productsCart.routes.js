import { Router } from "express";

import { verifyToken } from "../jwt/jwt.js";
import {
    getProductsCart,
    addProductCart,
    deleteProductCart,
} from "../controllers/productCart.controllers.js";

const router = Router();

// Any user can have a cart and add products to it

router.get("/productsCart", verifyToken, getProductsCart);

router.post("/productsCart", verifyToken, addProductCart);

router.delete("/productsCart/:id", verifyToken, deleteProductCart);

export { router as productsCartRoutes };

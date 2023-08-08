import { Router } from "express";

import { verifyToken } from "../jwt/jwt.js";
import { checkAdmin } from "../authentication/checkadmin.js";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
} from "../controllers/product.controllers.js";

const router = Router();

// Any user can get the products
router.get("/products", getProducts);
router.get("/products/:code", getProduct);

// Only admins can create, update and delete products
router.post("/products", verifyToken, checkAdmin, createProduct);

router.put("/products/:code", verifyToken, checkAdmin, updateProduct);
router.put(
    "/products/stock/:code",
    verifyToken,
    checkAdmin,
    updateProductStock
);

router.delete("/products/:code", verifyToken, checkAdmin, deleteProduct);

export { router as productRoutes };

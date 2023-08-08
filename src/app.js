import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import {
    adminRoutes,
    productRoutes,
    productsCartRoutes,
    buyRoutes,
    sessionRoutes,
    userRoutes,
} from "./routes/index.js";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000); // If the environment variable PORT exists, use it. If not, use 3000

// Middlewares
app.use(cors()); // This allows the communication between different servers (front-end and back-end)
app.use(express.json()); // This allows the server to understand JSON
app.use(express.urlencoded({ extended: false })); // This allows the server to understand form data
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./upload",
    })
); // This allows the server to understand file uploads, and save the files in the upload folder

// Routes
app.use(
    "/api",
    adminRoutes,
    productRoutes,
    productsCartRoutes,
    buyRoutes,
    sessionRoutes,
    userRoutes
);

export { app };

import { createHash } from "crypto";

import { user } from "../models/user.js";
import { generateToken } from "../jwt/jwt.js";

// Login
export const login = async (req, res) => {
    // Check if the fields are empty
    if (!req.body.email || !req.body.password)
        return res.status(400).json({ message: "Missing fields" });

    // Encrypt the password
    req.body.password = createHash("sha256")
        .update(req.body.password)
        .digest("base64");

    // Find a user with the email and password provided
    await user
        .findOne({ email: req.body.email, password: req.body.password })
        .then((user) => {
            // If there is no user, return an error
            if (!user)
                return res.status(404).json({ message: "Invalid credentials" });

            // If there is a user, generate a token and return it
            // The token expires in 24 hours
            res.status(200).json({
                token: generateToken(user, "24h"),
            });
        })
        .catch((err) => res.status(400).json({ err }));
};

// Register
export const register = async (req, res) => {
    // Check if the fields are empty
    if (!req.body.name || !req.body.email || !req.body.password)
        return res.status(400).json({ message: "Missing fields" });

    // Encrypt the password
    req.body.password = createHash("sha256")
        .update(req.body.password)
        .digest("base64");

    // Create the user
    // If the email already exists, return an error
    await user
        .create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        .then((user) => res.status(201).json({ user }))
        .catch((err) =>
            res.status(400).json({ message: "Email already exists" })
        );
};

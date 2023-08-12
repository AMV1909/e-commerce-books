import { createHash } from "crypto";

import { user } from "../models/user.js";
import { generateToken } from "../jwt/jwt.js";
import { validateUser, validateUserLogin } from "../schemas/user.schema.js";

// Login
export const login = async (req, res) => {
    // Validate the fields
    const result = validateUserLogin(req.body);

    // If the fields are invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Encrypt the password
    result.data.password = createHash("sha256")
        .update(result.data.password)
        .digest("base64");

    // Find a user with the email and password provided
    await user
        .findOne(result.data)
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
    // Validate the fields
    const result = validateUser(req.body);

    // If the fields are invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Encrypt the password
    result.data.password = createHash("sha256")
        .update(result.data.password)
        .digest("base64");

    // Create the user
    // If the email already exists, return an error
    await user
        .create(result.data)
        .then((user) => res.status(201).json({ user }))
        .catch((err) =>
            res.status(400).json({ message: "Email already exists" })
        );
};

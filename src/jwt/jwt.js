import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

// Generate a token
// payload: data to be stored in the token
// expiresIn: time in which the token expires (e.g. "24h")
export const generateToken = (payload, expiresIn) => {
    return jwt.sign({ payload }, process.env.SECRET_KEY, { expiresIn });
};

// Verify a token
// This function is used as middleware in the routes
// Purpose: Check if the user is logged in
export const verifyToken = (req, res, next) => {
    // Get the token from the headers
    const token = req.headers["x-access-token"];

    // If there is no token, return an error
    if (!token)
        return res
            .status(403)
            .json({ auth: false, message: "No token provided" });

    // If there is a token, verify it with the secret key
    // We use env variables to hide sensitive data
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        // If the token is invalid, return an error
        if (err)
            return res
                .status(500)
                .json({ message: "Failed to authenticate token" });

        // If the token is valid, store the decoded payload in the request and continue
        req.decoded = decoded.payload;
        next();
    });
};

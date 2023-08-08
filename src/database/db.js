import { connect } from "mongoose";
import { config } from "dotenv";

config();

// Destructure env variables
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env;

// Set the URI based on the environment
const URI = NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI;

// Connect to MongoDB
// We use env variables to hide sensitive data
export const connectDB = await connect(URI)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => {
        throw new Error(err);
    });

import { Schema, model } from "mongoose";

export const user = model(
    "User",
    new Schema({
        admin: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            url: String,
            public_id: String,
        },
        address: String,
    })
);

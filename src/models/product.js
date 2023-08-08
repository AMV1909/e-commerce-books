import { Schema, model } from "mongoose";

export const product = model(
    "Product",
    new Schema({
        code: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        type: {
            type: String,
            required: true,
            enum: ["book", "product"],
        },

        // Specific fields for books
        isbn: {
            type: String,
            required: function () {
                return this.type === "book";
            },
            unique: true,
        },
        author: {
            type: String,
            required: function () {
                return this.type === "book";
            },
        },
        publisher: {
            type: String,
            required: function () {
                return this.type === "book";
            },
        },
    })
);

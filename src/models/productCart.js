import { Schema, model } from "mongoose";

export const productCart = model(
    "ProductCart",
    new Schema({
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: Object,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    })
);

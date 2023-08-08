import { Schema, model } from "mongoose";

export const sale = model(
    "Sale",
    new Schema({
        products: [
            {
                product: {
                    type: Object,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        distributor: {
            type: String,
            required: true,
        },
    })
);

import { product } from "../models/product.js";
import {
    validateBook,
    validateBookUpdate,
    validateProduct,
    validateProductUpdate,
    validateStock,
    validateTypeProduct,
} from "../schemas/product.schema.js";

// Get all products, maybe used for a search bar or something
export const getProducts = async (req, res) => {
    await product
        .find()
        .then((products) => res.status(200).json({ products }))
        .catch((err) => res.status(400).json({ err }));
};

// Get a product by its code
export const getProduct = async (req, res) => {
    await product
        .findOne({ code: req.params.code })
        .then((product) => res.status(200).json({ product }))
        .catch((err) => res.status(400).json({ err }));
};

// Create a product
export const createProduct = async (req, res) => {
    // Check the type of the product
    let result = validateTypeProduct(req.body.type);

    // If the type is invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Depending on the type, validate the fields and create the product
    if (result.data.type === "book") {
        result = validateBook(req.body);

        // If the book is invalid, return an error
        if (!result.success) return res.status(400).json(result.error);

        // Create the book
        await product
            .create(result.data)
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                // if the ISBN is repeated, return an error
                if (err.code === 11000)
                    return res.status(400).json({ isbn: "ISBN repeated" });

                res.status(400).json(err);
            });
    } else {
        result = validateProduct(req.body);

        // If the product is invalid, return an error
        if (!result.success) return res.status(400).json(result.error);

        // Create the product
        await product
            .create(result.data)
            .then((data) => res.status(201).json(data))
            .catch((err) => res.status(400).json(err));
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    // Check the type of the product
    let result = validateTypeProduct(req.body.type);

    // If the type is invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Depending on the type, validate the fields and update the product
    if (result.data.type === "book") {
        result = validateBookUpdate(req.body);

        // If the book is invalid, return an error
        if (!result.success) return res.status(400).json(result.error);

        // Update the book
        await product
            .findOneAndUpdate(
                { code: req.params.code },
                { $set: result.data },
                {
                    new: true,
                }
            )
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                // if the ISBN is repeated, return an error
                if (err.code === 11000)
                    return res.status(400).json({ isbn: "ISBN repeated" });

                res.status(400).json(err);
            });
    } else {
        result = validateProductUpdate(req.body);

        // If the product is invalid, return an error
        if (!result.success) return res.status(400).json(result.error);

        // Update the product
        await product
            .findOneAndUpdate(
                { code: req.params.code },
                { $set: result.data },
                {
                    new: true,
                }
            )
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(400).json(err));
    }
};

// Update the stock of a product
export const updateProductStock = async (req, res) => {
    // Validate the fields
    const result = validateStock(req.body.stock);

    // If the stock is invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Update the stock
    await product
        .findOneAndUpdate(
            { code: req.params.code },
            { $set: { stock: result.data } },
            { new: true }
        )
        .then((data) => res.status(200).json({ data }))
        .catch((err) => res.status(400).json({ err }));
};

// Delete a product
export const deleteProduct = async (req, res) => {
    await product
        .deleteOne({ code: req.params.code })
        .then(() => res.status(200).json({ message: "Product deleted" }))
        .catch((err) => res.status(400).json(err));
};

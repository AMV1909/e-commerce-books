import { productCart } from "../models/productCart.js";
import { product } from "../models/product.js";

// Get all products in cart
export const getProductsCart = async (req, res) => {
    // The _id is the id of the user decoded in the middleware
    await productCart
        .find({ owner: req.decoded._id })
        .then((productsCart) => res.status(200).json({ productsCart }))
        .catch((err) => res.status(400).json({ err }));
};

// Add a product to the cart
export const addProductCart = async (req, res) => {
    // Check if the fields are empty
    if (!req.body.code || !req.body.quantity)
        return res.status(400).json({ message: "Missing fields" });

    // Initialize the new product in null by now
    let newProductCart = null;

    // Search the product by the code
    await product
        .findOne({ code: req.body.code })
        .then((data) => {
            // Check if the product exists
            if (!data)
                return res.status(400).json({ message: "Product not found" });

            // Check if the stock is enough
            if (data.stock < req.body.quantity)
                return res.status(400).json({ message: "Insufficient stock" });

            // If the product exists and the stock is enough, save the product in the variable
            newProductCart = data;
        })
        .catch((err) => res.status(400).json({ err }));

    // After checking the product, add the product to the cart
    await productCart
        .create({
            product: newProductCart,
            quantity: req.body.quantity,
            owner: req.decoded._id,
        })
        .then((productCart) => res.status(201).json({ productCart }))
        .catch((err) => res.status(400).json({ err }));
};

// Delete a product from the cart
export const deleteProductCart = async (req, res) => {
    await productCart
        .findOneAndDelete({ _id: req.params.id })
        .then((productCart) => res.status(200).json({ productCart }))
        .catch((err) => res.status(400).json({ err }));
};

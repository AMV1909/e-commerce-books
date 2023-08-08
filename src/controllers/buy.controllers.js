import { sale } from "../models/sale.js";
import { product } from "../models/product.js";
import { productCart } from "../models/productCart.js";
import { validateBuy, validateDirectBuy } from "../schemas/buy.schema.js";

// Get all sales (only admin)
export const getSales = async (req, res) => {
    await sale
        .find()
        .then((sales) => res.status(200).json({ sales }))
        .catch((err) => res.status(400).json({ err }));
};

// Buy a product (directly without adding to cart)
export const buyProduct = async (req, res) => {
    // Validate the fields
    const result = validateDirectBuy(req.body);

    // If the fields are invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Search the product by code
    await product
        .findOne({ code: result.data.code })
        .then(async (data) => {
            // Check if the product exists
            if (!data)
                return res.status(400).json({ message: "Product not found" });

            // Check if the stock is enough
            if (data.stock < result.data.quantity)
                return res.status(400).json({ message: "Insufficient stock" });

            // Find the product and update the stock
            await product
                .findOneAndUpdate(
                    { code: result.data.code },
                    { $set: { stock: data.stock - result.data.quantity } },
                    { new: true }
                )
                .then(async () => {
                    // After updating the stock, create the sale with the product
                    await sale
                        .create({
                            products: [
                                {
                                    product: data,
                                    quantity: result.data.quantity,
                                },
                            ],
                            distributor: result.data.distributor,
                            total: data.price * result.data.quantity,
                        })
                        .then((sale) => res.status(201).json({ sale }))
                        .catch((err) => res.status(400).json({ err }));
                })
                .catch((err) => res.status(400).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
};

// Buy all products from the cart
export const buyCartProducts = async (req, res) => {
    // Validate the fields
    const result = validateBuy(req.body);

    // If the fields are invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Get all products from the cart of the user
    // The _id is the id of the user decoded in the middleware
    await productCart
        .find({ owner: req.decoded._id })
        .then(async (data) => {
            // Check if the cart is empty
            if (data.length === 0)
                return res.status(400).json({ message: "Cart is empty" });

            // Initialize the total in 0 to add the total of the sale
            let total = 0;

            for (let i = 0; i < data.length; i++) {
                // Check if the stock is enough
                // If not, return an error
                if (data[i].product.stock < data[i].quantity)
                    return res
                        .status(400)
                        .json({ message: "Insufficient stock" });

                // Add the total of the product to the total of the sale
                total += data[i].product.price * data[i].quantity;
            }

            for (let i = 0; i < data.length; i++) {
                // Find each product and update the stock
                await product
                    .findOneAndUpdate(
                        { code: data[i].product.code },
                        {
                            $set: {
                                stock: data[i].product.stock - data[i].quantity,
                            },
                        },
                        { new: true }
                    )
                    .catch((err) => res.status(400).json({ err }));
            }

            // Create the sale with the products of the cart
            await sale
                .create({
                    products: data,
                    distributor: result.data.distributor,
                    total,
                })
                .then((sale) => res.status(201).json({ sale }))
                .catch((err) => res.status(400).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
};

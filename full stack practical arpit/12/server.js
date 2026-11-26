
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// =========================
// PRODUCT MODEL
// =========================

const Product = mongoose.model(
    "ShopProduct",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0.01
        },

        description: {
            type: String,
            default: ""
        }

    }, { timestamps: true })
);


// =========================
// ORDER MODEL
// =========================

const Order = mongoose.model(
    "ShopOrder",
    new mongoose.Schema({

        items: [{
            productId: {
                type: String,
                required: true
            },

            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true,
                min: 0.01
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],

        total: {
            type: Number,
            required: true,
            min: 0.01
        },

        customerEmail: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "Demo payment successful"
        }

    }, { timestamps: true })
);


// =========================
// GET ALL PRODUCTS
// =========================

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1
        });

        res.json(products);

    } catch (error) {
        res.status(500).json({
            error: "Unable to load products."
        });
    }
});


// =========================
// ADD PRODUCT
// =========================

app.post("/api/products", async (req, res) => {
    try {
        const { name, price, description } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                error: "Enter a valid product name and price."
            });
        }

        const product = await Product.create({
            name: name.trim(),
            price: Number(price),
            description: typeof description === "string"
                ? description.trim()
                : ""
        });

        res.status(201).json(product);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


// =========================
// EDIT PRODUCT
// =========================

app.put("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                error: "Invalid product ID."
            });
        }

        if (
            typeof name !== "string" ||
            !name.trim() ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                error: "Enter a valid product name and price."
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                price: Number(price),
                description: typeof description === "string"
                    ? description.trim()
                    : ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found."
            });
        }

        res.json(product);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


// =========================
// DELETE PRODUCT
// =========================

app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                error: "Invalid product ID."
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found."
            });
        }

        res.json({
            message: "Product deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            error: "Unable to delete product."
        });
    }
});


// =========================
// PLACE ORDER - SECURE CHECKOUT
// =========================

app.post("/api/orders", async (req, res) => {
    try {
        const { items, customerEmail } = req.body;

        // Validate email

        if (
            typeof customerEmail !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
        ) {
            return res.status(400).json({
                error: "Enter a valid email address."
            });
        }

        // Validate cart

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Your cart is empty."
            });
        }

        if (items.length > 50) {
            return res.status(400).json({
                error: "Too many different products in the cart."
            });
        }

        const productIds = [];

        for (const item of items) {

            if (
                !item ||
                typeof item.productId !== "string" ||
                !/^[a-f\d]{24}$/i.test(item.productId)
            ) {
                return res.status(400).json({
                    error: "Invalid product ID."
                });
            }

            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 99
            ) {
                return res.status(400).json({
                    error: "Invalid product quantity."
                });
            }

            productIds.push(item.productId);
        }

        // Reject duplicate product IDs

        if (new Set(productIds).size !== productIds.length) {
            return res.status(400).json({
                error: "Duplicate products found in cart."
            });
        }

        // Fetch actual products from MongoDB

        const products = await Product.find({
            _id: { $in: productIds }
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({
                error: "One or more products no longer exist."
            });
        }

        // Create order using database prices

        const orderItems = items.map(item => {

            const product = products.find(
                p => p._id.toString() === item.productId
            );

            return {
                productId: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        // Calculate total on the server

        const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Save order in MongoDB

        const order = await Order.create({
            items: orderItems,
            total,
            customerEmail: customerEmail.trim().toLowerCase(),
            status: "Demo payment successful"
        });

        res.status(201).json(order);

    } catch (error) {
        console.error("Checkout error:", error.message);

        res.status(500).json({
            error: "Unable to place order. Please try again."
        });
    }
});


// =========================
// GET ALL ORDERS
// =========================

app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({
            createdAt: -1
        });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            error: "Unable to load orders."
        });
    }
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3006;

mongoose.connect(process.env.MONGO_URI)

    .then(async () => {

        console.log("MongoDB connected successfully!");

        if (await Product.countDocuments() === 0) {

            await Product.insertMany([
                {
                    name: "Notebook",
                    price: 80,
                    description: "Ruled notebook"
                },
                {
                    name: "Backpack",
                    price: 899,
                    description: "Everyday backpack"
                },
                {
                    name: "Water Bottle",
                    price: 250,
                    description: "Reusable bottle"
                }
            ]);

            console.log("Default products added.");
        }

        app.listen(PORT, () => {
            console.log(
                `E-commerce demo: http://localhost:${PORT}`
            );
        });

    })

    .catch(error => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

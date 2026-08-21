const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.status(200).json({
            status: "success",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: Number(quantity)
            });
        }

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            status: "success",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item =>
                item.product.toString() ===
                req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not in cart"
            });
        }

        const product = await Product.findById(
            req.params.productId
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        if (Number(quantity) > product.stock) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        item.quantity = Number(quantity);

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            status: "success",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item =>
                item.product.toString() !==
                req.params.productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            status: "success",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            status: "success",
            message: "Cart cleared"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
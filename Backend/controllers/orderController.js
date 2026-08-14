const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let subtotal = 0;

        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    message: "Product no longer exists"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            subtotal += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const shipping = 20;
        const total = subtotal + shipping;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            subtotal,
            shipping,
            total
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({
            status: "success",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            status: "success",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};
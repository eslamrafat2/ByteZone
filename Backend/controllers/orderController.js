const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const { fullName, phone, address, city, notes = "" } = req.body;
        if (!fullName?.trim() || !phone?.trim() || !address?.trim() || !city?.trim()) {
            return res.status(400).json({ message: "Full name, phone, address and city are required" });
        }
        if (!/^[0-9+\s()\-]{7,20}$/.test(phone.trim())) {
            return res.status(400).json({ message: "Please enter a valid phone number" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let subtotal = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.product;
            if (!product) return res.status(400).json({ message: "Product no longer exists" });
            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(409).json({ message: `${product.name} only has ${product.stock} item(s) left in stock. Please update your cart before checkout.` });
            }
            subtotal += product.price * item.quantity;
            orderItems.push({ product: product._id, name: product.name, price: product.price, quantity: item.quantity });
        }

        const shipping = 20;
        const total = subtotal + shipping;
        const decremented = [];

        // Decrement stock atomically per item. The stock condition prevents a stale cart
        // from buying more than is currently available, even if stock changed after checkout opened.
        for (const item of cart.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
            if (!updatedProduct) {
                for (const previous of decremented) {
                    await Product.findByIdAndUpdate(previous.productId, { $inc: { stock: previous.quantity } });
                }
                return res.status(409).json({ message: `${item.product.name} is no longer available in the requested quantity. Please update your cart and try again.` });
            }
            decremented.push({ productId: item.product._id, quantity: item.quantity });
        }

        try {
            const order = await Order.create({
                user: req.user._id,
                customer: { fullName: fullName.trim(), phone: phone.trim(), address: address.trim(), city: city.trim(), notes: typeof notes === "string" ? notes.trim() : "" },
                items: orderItems,
                subtotal,
                shipping,
                total
            });

            cart.items = [];
            await cart.save();

            return res.status(201).json({ status: "success", order });
        } catch (orderError) {
            for (const previous of decremented) {
                await Product.findByIdAndUpdate(previous.productId, { $inc: { stock: previous.quantity } });
            }
            throw orderError;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
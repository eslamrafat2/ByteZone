const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const products = await Product.find(filter).sort({
            createdAt: -1
        });

        res.status(200).json({
            status: "success",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "success",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            status: "success",
            product
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "success",
            product
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const compareProducts = async (req, res) => {
    try {
        const ids = req.query.ids
            ? req.query.ids.split(",")
            : [];

        if (ids.length === 0) {
            return res.status(400).json({
                message: "Please provide product ids"
            });
        }

        const products = await Product.find({
            _id: {
                $in: ids
            }
        });

        res.status(200).json({
            status: "success",
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    compareProducts
};
const Product = require("../models/Product");

const createUploadedProduct = async (req,res)=>{
    try { if(!req.file) return res.status(400).json({message:"Product image is required"}); res.status(201).json({status:"success",image:`/uploads/${req.file.filename}`}); }
    catch(error){res.status(400).json({message:error.message});}
};

const addStockStatus = (product) => {
    const data = product.toObject();

    data.inStock = data.stock > 0;

    return data;
};

const parsePositiveInteger = (value, defaultValue, name) => {
    if (value === undefined) {
        return defaultValue;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw new Error(`${name} must be a positive integer`);
    }

    return parsedValue;
};

const productSorts = {
    default: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    nameAsc: { name: 1 },
    nameDesc: { name: -1 },
    newest: { createdAt: -1 }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            brand,
            availability,
            sort = "default"
        } = req.query;

        const page = parsePositiveInteger(req.query.page, 1, "page");
        const limit = parsePositiveInteger(req.query.limit, 12, "limit");

        if (limit > 100) {
            return res.status(400).json({
                message: "limit must not exceed 100"
            });
        }

        if (!productSorts[sort]) {
            return res.status(400).json({
                message: "Invalid sort value"
            });
        }

        if (availability && !["inStock", "outOfStock", "all"].includes(availability)) {
            return res.status(400).json({
                message: "Invalid availability value"
            });
        }

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (brand) {
            filter.brand = brand;
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
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                const parsedMinPrice = Number(minPrice);

                if (!Number.isFinite(parsedMinPrice)) {
                    return res.status(400).json({
                        message: "minPrice must be a number"
                    });
                }

                filter.price.$gte = parsedMinPrice;
            }

            if (maxPrice !== undefined) {
                const parsedMaxPrice = Number(maxPrice);

                if (!Number.isFinite(parsedMaxPrice)) {
                    return res.status(400).json({
                        message: "maxPrice must be a number"
                    });
                }

                filter.price.$lte = parsedMaxPrice;
            }
        }

        if (availability === "inStock") {
            filter.stock = { $gt: 0 };
        }

        if (availability === "outOfStock") {
            filter.stock = 0;
        }

        const total = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const products = await Product.find(filter)
            .sort(productSorts[sort])
            .skip((page - 1) * limit)
            .limit(limit);

        const productsWithStatus = products.map(
            addStockStatus
        );

        const [categories, brands] = await Promise.all([
            Product.distinct("category"),
            Product.distinct("brand")
        ]);

        res.status(200).json({
            status: "success",
            count: productsWithStatus.length,
            total,
            page,
            limit,
            totalPages,
            categories: categories.sort(),
            brands: brands.sort(),
            products: productsWithStatus
        });

    } catch (error) {
        if (error.message === "page must be a positive integer" ||
            error.message === "limit must be a positive integer") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "success",
            product: addStockStatus(product)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// CREATE PRODUCT - ADMIN
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            status: "success",
            product: addStockStatus(product)
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// UPDATE PRODUCT - ADMIN
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
            product: addStockStatus(product)
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE PRODUCT - ADMIN
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


// COMPARE PRODUCTS
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

        const productsWithStatus = products.map(
            addStockStatus
        );

        res.status(200).json({
            status: "success",
            products: productsWithStatus
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
    createUploadedProduct,
    updateProduct,
    deleteProduct,
    compareProducts
};

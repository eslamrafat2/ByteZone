const express = require("express");

const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    compareProducts
} = require("../controllers/productController");

const { protect } = require("../middelwares/auth.middleware");
const { adminOnly } = require("../middelwares/admin.middleware");

router.get("/", getProducts);

router.get("/compare", compareProducts);

router.get("/:id", getProductById);

router.post(
    "/",
    protect,
    adminOnly,
    createProduct
);

router.put(
    "/:id",
    protect,
    adminOnly,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteProduct
);

module.exports = router;
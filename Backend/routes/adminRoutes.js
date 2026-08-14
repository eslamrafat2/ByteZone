const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/adminController");

const { protect } = require("../middelwares/auth.middleware");
const { adminOnly } = require("../middelwares/admin.middleware");

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getDashboard
);

router.get(
    "/orders",
    protect,
    adminOnly,
    getAllOrders
);

router.put(
    "/orders/:id",
    protect,
    adminOnly,
    updateOrderStatus
);

module.exports = router;
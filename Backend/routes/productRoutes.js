const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  compareProducts,
  createUploadedProduct,
} = require("../controllers/productController");

const {
  getProductReviews,
  getReviewEligibility,
  addProductReview,
  deleteProductReview,
} = require("../controllers/reviewController");

const { protect } = require("../middelwares/auth.middleware");
const { adminOnly } = require("../middelwares/admin.middleware");
const upload = require("../middelwares/upload.middleware");

router.get("/", getProducts);
router.post(
  "/upload-image",
  protect,
  adminOnly,
  upload.single("image"),
  createUploadedProduct,
);

router.get("/compare", compareProducts);

router.get("/:id/reviews", getProductReviews);
router.get("/:id/review-eligibility", protect, getReviewEligibility);
router.post("/:id/reviews", protect, addProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

router.get("/:id", getProductById);

router.post("/", protect, adminOnly, createProduct);

router.put("/:id", protect, adminOnly, updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;

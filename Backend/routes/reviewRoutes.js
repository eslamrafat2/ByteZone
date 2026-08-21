const express = require("express");

const router = express.Router();

const {
    getProductReviews,
    getReviewEligibility,
    addProductReview,
    deleteProductReview
} = require("../controllers/reviewController");

const { protect } = require("../middelwares/auth.middleware");

router.get("/:id/reviews", getProductReviews);
router.get("/:id/review-eligibility", protect, getReviewEligibility);
router.post("/:id/reviews", protect, addProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

module.exports = router;

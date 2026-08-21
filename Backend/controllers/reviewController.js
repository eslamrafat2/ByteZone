const Review = require("../models/Review");
const Product = require("../models/Product");

const toReview = (r) => ({
  _id: r._id,
  user: r.user
    ? { _id: r.user._id, name: r.user.name, email: r.user.email }
    : null,
  product: r.product
    ? {
        _id: r.product._id,
        name: r.product.name,
        image: r.product.image,
        price: r.product.price,
      }
    : null,
  rating: r.rating,
  comment: r.comment,
  approved: r.approved,
  createdAt: r.createdAt,
  approvedAt: r.approvedAt,
});

const getProductReviews = async (req, res) => {
  try {
    if (!(await Product.exists({ _id: req.params.id })))
      return res.status(404).json({ message: "Product not found" });
    const reviews = await Review.find({
      product: req.params.id,
      approved: true,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    const averageRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
    res.json({
      status: "success",
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviews: reviews.map(toReview),
    });
  } catch (e) {
    res.status(500).json({ status: "failed", message: e.message });
  }
};

const getReviewEligibility = async (req, res) => {
  try {
    const Order = require("../models/Order");
    const eligible = !!(await Order.exists({
      user: req.user._id,
      status: { $ne: "cancelled" },
      "items.product": req.params.id,
    }));
    const existingReview = await Review.findOne({
      product: req.params.id,
      user: req.user._id,
    }).select("_id approved");
    res.json({
      status: "success",
      eligible,
      alreadyReviewed: !!existingReview,
      approved: existingReview?.approved ?? false,
    });
  } catch (e) {
    res.status(500).json({ status: "failed", message: e.message });
  }
};

const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!(await Product.exists({ _id: req.params.id })))
      return res.status(404).json({ message: "Product not found" });
    const Order = require("../models/Order");
    const purchased = await Order.exists({
      user: req.user._id,
      status: { $ne: "cancelled" },
      "items.product": req.params.id,
    });
    if (!purchased)
      return res.status(403).json({
        message: "You can review this product only after purchasing it.",
      });
    const r = Number(rating),
      c = String(comment || "").trim();
    if (!Number.isInteger(r) || r < 1 || r > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    if (!c)
      return res.status(400).json({ message: "Review comment is required" });
    if (c.length > 1000)
      return res
        .status(400)
        .json({ message: "Review comment must not exceed 1000 characters" });
    if (await Review.findOne({ product: req.params.id, user: req.user._id }))
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    const review = await Review.create({
      user: req.user._id,
      product: req.params.id,
      rating: r,
      comment: c,
      approved: false,
    });
    await review.populate("user", "name");
    res.status(201).json({
      status: "success",
      message: "Review submitted and is waiting for admin approval.",
      review: toReview(review),
    });
  } catch (e) {
    res.status(e.code === 11000 ? 400 : 500).json({
      status: "failed",
      message:
        e.code === 11000 ? "You have already reviewed this product" : e.message,
    });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      product: req.params.id,
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    await review.deleteOne();
    res.json({ status: "success", message: "Review deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getAdminReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status === "pending") filter.approved = false;
    if (req.query.status === "approved") filter.approved = true;
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name image price")
      .sort({ createdAt: -1 });
    res.json({
      status: "success",
      count: reviews.length,
      reviews: reviews.map(toReview),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateReviewApproval = async (req, res) => {
  try {
    if (typeof req.body.approved !== "boolean")
      return res
        .status(400)
        .json({ message: "approved must be true or false" });
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    review.approved = req.body.approved;
    review.approvedAt = review.approved ? new Date() : null;
    await review.save();
    await review.populate("user", "name email");
    await review.populate("product", "name image price");
    res.json({
      status: "success",
      message: review.approved
        ? "Review approved successfully"
        : "Review unpublished successfully",
      review: toReview(review),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ status: "success", message: "Review deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getProductReviews,
  getReviewEligibility,
  addProductReview,
  deleteProductReview,
  getAdminReviews,
  updateReviewApproval,
  deleteAdminReview,
};

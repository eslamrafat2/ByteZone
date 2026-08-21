const express=require("express");
const router=express.Router();
const {getDashboard,getUsers,getAllOrders,updateOrderStatus}=require("../controllers/adminController");
const {getAdminReviews,updateReviewApproval,deleteAdminReview}=require("../controllers/reviewController");
const {protect}=require("../middelwares/auth.middleware");
const {adminOnly}=require("../middelwares/admin.middleware");

router.use(protect,adminOnly);
router.get("/dashboard",getDashboard);
router.get("/users",getUsers);
router.get("/orders",getAllOrders);
router.put("/orders/:id",updateOrderStatus);
router.get("/reviews",getAdminReviews);
router.put("/reviews/:reviewId",updateReviewApproval);
router.delete("/reviews/:reviewId",deleteAdminReview);
module.exports=router;

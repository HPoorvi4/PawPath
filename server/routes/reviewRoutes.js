import express from "express";
import {
  getTop5Reviews,
  getAllReviews,
  submitReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/top5", getTop5Reviews);
router.get("/", getAllReviews);
router.post("/", submitReview);

export default router;

import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createLostFoundReport,
  getLostLocations,
  getLostPets,
  getFoundPets,
  getLostFoundById,
  getComments,
  postComment,
} from "../controllers/lostFoundController.js";

const router = express.Router();

// Lost & Found routes
router.post("/", upload.single("photo"), createLostFoundReport);
router.get("/locations", getLostLocations);
router.get("/lost", getLostPets);
router.get("/found", getFoundPets);
router.get("/:id", getLostFoundById);

// Comments routes (these use the same router since they're related)
router.get("/:lostId", getComments); // This handles /api/lost-comments/:lostId
router.post("/", postComment); // This handles /api/lost-comments

export default router;

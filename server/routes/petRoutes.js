import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createPet,
  getDropdowns,
  getPets,
  getNearbyPets,
  getPetById,
  getListedPets,
  deletePet,
  updatePet,
} from "../controllers/petController.js";

const router = express.Router();

router.post("/", upload.single("photo"), createPet);
router.get("/dropdowns", getDropdowns);
router.get("/nearby", getNearbyPets);
router.get("/listed/:userId", getListedPets);
router.get("/:id", getPetById);
router.get("/", getPets);
router.delete("/:id", deletePet);
router.patch("/:id", updatePet);

export default router;

import express from "express";
import {
  getPetNamesFromAPI,
  getRandomPetName,
} from "../controllers/petNameController.js";

const router = express.Router();

router.get("/random", getRandomPetName);
router.get("/", getPetNamesFromAPI);

export default router;

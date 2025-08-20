import express from "express";
import { adoptPet, getAdoptions } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", adoptPet);
router.get("/:userId", getAdoptions);

export default router;

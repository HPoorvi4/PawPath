import express from "express";
import { getVets, getVetById } from "../controllers/vetController.js";

const router = express.Router();

router.get("/", getVets);
router.get("/:id", getVetById);

export default router;

import express from "express";
import {
  getBookedSlots,
  bookAppointment,
  getUserAppointments,
  deleteAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/booked", getBookedSlots);
router.post("/", bookAppointment);
router.get("/user/:userId", getUserAppointments);
router.delete("/:id", deleteAppointment);
router.put("/:id", updateAppointment);

export default router;

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cron from "node-cron";
import { sendAppointmentReminders } from "./controllers/appointmentController.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import vetRoutes from "./routes/vetRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import petNameRoutes from "./routes/petNameRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/lost_uploads", express.static("lost_uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/vets", vetRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/lost-comments", lostFoundRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/pet-names", petNameRoutes);

// Cron job for appointment reminders - runs every hour

cron.schedule("0 * * * *", sendAppointmentReminders);

app.listen(PORT, () => {
  console.log(`Server is live at port ${PORT}`);
});

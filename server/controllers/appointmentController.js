import db from "../config/database.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const LEAD_HOURS = Number(process.env.REMINDER_LEAD_HOURS || 24);

// Get booked time slots for vet on selected date
export const getBookedSlots = async (req, res) => {
  const { vetId, date } = req.query;
  try {
    const result = await db.query(
      "SELECT time FROM appointments WHERE vet_id = $1 AND date = $2",
      [vetId, date]
    );
    res.json(result.rows.map((r) => r.time));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { user_id, vet_id, vet_name, date, time } = req.body;
  try {
    const conflict = await db.query(
      "SELECT * FROM appointments WHERE vet_id = $1 AND date = $2 AND time = $3",
      [vet_id, date, time]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    await db.query(
      "INSERT INTO appointments (user_id, vet_id, vet_name, date, time) VALUES ($1, $2, $3, $4, $5)",
      [user_id, vet_id, vet_name, date, time]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
};

// Get user appointments
export const getUserAppointments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, vet_id, vet_name, date, time, status
       FROM appointments
       WHERE user_id = $1
       ORDER BY date DESC, time`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    await db.query("DELETE FROM appointments WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// Update appointment (reschedule)
export const updateAppointment = async (req, res) => {
  const { date, time } = req.body;
  const appointmentId = req.params.id;

  try {
    const current = await db.query(
      "SELECT vet_id FROM appointments WHERE id = $1",
      [appointmentId]
    );
    if (current.rows.length === 0)
      return res.status(404).json({ error: "Appointment not found" });

    const vetId = current.rows[0].vet_id;

    const conflict = await db.query(
      "SELECT * FROM appointments WHERE vet_id = $1 AND date = $2 AND time = $3 AND id != $4",
      [vetId, date, time, appointmentId]
    );

    if (conflict.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Selected time slot already booked" });
    }

    await db.query(
      "UPDATE appointments SET date = $1, time = $2 WHERE id = $3",
      [date, time, appointmentId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Send appointment reminders (for cron job)
export const sendAppointmentReminders = async () => {
  console.log("🔔 Running appointment reminder job...");
  try {
    const { rows } = await db.query(
      `SELECT a.id,
              a.date,
              a.time,
              a.vet_name,
              u.email,
              u.name AS user_name
         FROM appointments a
         JOIN users u ON a.user_id = u.id
        WHERE a.reminder_sent = false
          AND (a.date + a.time)
              BETWEEN NOW()
                  AND NOW() + INTERVAL '${LEAD_HOURS} HOURS'`
    );

    for (const appt of rows) {
      const when = new Date(
        `${appt.date.toISOString().slice(0, 10)}T${appt.time}`
      ).toLocaleString();

      const mailOptions = {
        from: `"PawPath" <${process.env.SMTP_USER}>`,
        to: appt.email,
        subject: `Reminder: Appointment in ${LEAD_HOURS} hours`,
        text:
          `Hi ${appt.user_name},\n\n` +
          `Just a friendly reminder: you have an appointment with Dr. ${appt.vet_name} on ${when}.\n\n` +
          `See you soon!\n— PawPath`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Reminder sent to ${appt.email} for appt ${appt.id}`);

      await db.query(
        `UPDATE appointments
            SET reminder_sent = true
          WHERE id = $1`,
        [appt.id]
      );
    }
  } catch (err) {
    console.error("❌ Error in reminder job:", err);
  }
};

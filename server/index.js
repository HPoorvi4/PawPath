import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from 'axios';
import cron from 'node-cron';
import nodemailer from 'nodemailer';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const PET_NAME_HOST = process.env.PET_NAME_HOST || 'pet-name-generator.p.rapidapi.com';
const PET_NAME_KEY  = process.env.PET_NAME_API_KEY; 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const LEAD_HOURS = Number(process.env.REMINDER_LEAD_HOURS || 24);


app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/lost_uploads', express.static('lost_uploads'));


const UPLOADS_FOLDER = './uploads';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

// Vet doc appointment 

// getting vet details  by location and availability date given by user 
app.get("/api/vets", async (req, res) => {
  const { location, date } = req.query;
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  try {
    const result = await db.query(
      `SELECT * FROM vets WHERE location = $1 AND available_days ILIKE '%' || $2 || '%'`,
      [location, dayName]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vets" });
  }
});

// Get vet by ID (gets complete detail do display in the vet details)
app.get("/api/vets/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM vets WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vet" });
  }
});

// Get booked time slots for vet on selected date (Based upon the vet choosen gets the time )
app.get("/api/appointments/booked", async (req, res) => {
  const { vetId, date } = req.query;
  try {
    const result = await db.query(
      "SELECT time FROM appointments WHERE vet_id = $1 AND date = $2",
      [vetId, date]
    );
    res.json(result.rows.map(r => r.time));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
});

// Book an appointment 
app.post("/api/appointments", async (req, res) => {
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
});


// registration 
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone, location } = req.body;
  try {
    const exists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const insertUser = await db.query(
      "INSERT INTO users (name, email, password, phone, location) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, password, phone, location]
    );

    const userId = insertUser.rows[0].id;
    res.json({ success: true, userId });
  } catch (err) {
    console.error("Registration Error:", err);
    res.json({ success: false, message: "Registration error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0)
      return res.json({ success: false, message: "User not found" });

    if (user.rows[0].password !== password)
      return res.json({ success: false, message: "Wrong password" });

    res.json({ success: true, userId: user.rows[0].id });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Login error" });
  }
});

// Listing of a pet 
app.post("/api/pets", upload.single("photo"), async (req, res) => {
  const {
    name,
    species,
    breed,
    age,
    gender,
    description,
    location,
    owner_id
  } = req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null; // Currently goes to local this uses multer

  try {
    await db.query(
      `INSERT INTO pets 
      (name, species, breed, age, gender, description, location, photo_url, owner_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, species, breed, age, gender, description, location, photo_url, owner_id]
    );
    res.json({ success: true, message: "Pet listed successfully" });
  } catch (err) {
    console.error("Error listing pet:", err);
    res.status(500).json({ success: false, message: "Error listing pet" });
  }
});

// Get dropdown options (In drop down it shows whatever is there in the data base only )
app.get('/api/pets/dropdowns', async (req, res) => {
  try {
    const speciesRes = await db.query("SELECT DISTINCT species FROM pets WHERE is_adopted = false");
    const breedRes = await db.query("SELECT DISTINCT breed FROM pets WHERE is_adopted = false");
    const genderRes = await db.query("SELECT DISTINCT gender FROM pets WHERE is_adopted = false");
    const locationRes = await db.query("SELECT DISTINCT location FROM pets WHERE is_adopted = false");

    res.json({
      species: speciesRes.rows.map(r => r.species),
      breed: breedRes.rows.map(r => r.breed),
      gender: genderRes.rows.map(r => r.gender),
      location: locationRes.rows.map(r => r.location),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dropdown data" });
  }
});

// Get pets with filters
app.get('/api/pets', async (req, res) => {
  const { species, breed, gender, location } = req.query;
  try {
    let query = "SELECT * FROM pets WHERE is_adopted = false";
    const values = [];

    if (species) { values.push(species); query += ` AND species = $${values.length}`; }
    if (breed)   { values.push(breed);   query += ` AND breed = $${values.length}`; }
    if (gender)  { values.push(gender);  query += ` AND gender = $${values.length}`; }
    if (location){ values.push(location);query += ` AND location = $${values.length}`; }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

// GET /api/pets/nearby?location=limit=6  (This is used in the home page to randomly list the pets in nearest loaction)
app.get('/api/pets/nearby', async (req, res) => {
  const { location, limit = 6 } = req.query;
  const limitInt = parseInt(limit, 10) || 6;

  try {
    const result = await db.query(
      `SELECT *
         FROM pets
        WHERE is_adopted = false
          AND location = $1
        ORDER BY listed_at DESC
        LIMIT $2`,
      [location, limitInt]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch nearby pets:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get pet details (When pressed details button on the pet card)
app.get("/api/pets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const petQuery = await db.query("SELECT * FROM pets WHERE id = $1", [id]);
    if (petQuery.rows.length === 0)
      return res.status(404).json({ msg: "Pet not found" });

    const pet = petQuery.rows[0];
    const ownerQuery = await db.query(
      "SELECT email, phone AS phone_number FROM users WHERE id = $1",
      [pet.owner_id]
    );
    res.json({ pet, owner: ownerQuery.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Adopt a pet (If we click adopt button on pet it will ad to adopted )
app.post("/api/adoptions", async (req, res) => {
  const { userId, petId } = req.body;
  try {
    const pet = await db.query("SELECT is_adopted FROM pets WHERE id = $1", [petId]);
    if (pet.rows[0].is_adopted) return res.status(400).json({ msg: "Already adopted" }); //This one checks for already adopted or not

    await db.query("INSERT INTO adoptions (user_id, pet_id) VALUES ($1, $2)", [userId, petId]);
    await db.query("UPDATE pets SET is_adopted = true WHERE id = $1", [petId]);

    res.json({ msg: "Adopted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add to favorites(If we click on the heart in pet cart it adds it to this favourites table)
app.post("/api/favorites", async (req, res) => {
  const { userId, petId } = req.body;
  try {
    await db.query("INSERT INTO favorites (user_id, pet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, petId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add to favorites" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is live at port ${PORT}`);
});


app.get("/api/users/:id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, phone, location
         FROM users 
        WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});




// Update user profile ()
app.put("/api/users/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4",
      [name, email, phone, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});



// Get favorite pets for a user (To display in my profile)
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*
      FROM favorites f
      JOIN pets p ON f.pet_id = p.id
      WHERE f.user_id = $1
    `, [req.params.userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching favorite pets:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Get adopted pets for a user (To display in my profile)
app.get("/api/adoptions/:userId", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, a.adopted_at
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.id
      WHERE a.user_id = $1
    `, [req.params.userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching adopted pets:", err);
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
});

//(To display in my profile) get listed 
app.get("/api/pets/listed/:userId", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM pets WHERE owner_id = $1 ORDER BY listed_at DESC",
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching listed pets:", err);
    res.status(500).json({ error: "Failed to fetch listed pets" });
  }
});

app.delete("/api/pets/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM pets WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({ error: "Failed to delete pet" });
  }
});

// DELETE FROM pets WHERE id = $1 AND is_adopted = false

app.get("/api/appointments/user/:userId", async (req, res) => {
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
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM appointments WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});


//  (reschedule) an appointment
app.put("/api/appointments/:id", async (req, res) => {
  const { date, time } = req.body;
  const appointmentId = req.params.id;

  try {
    // gets the  vet_id of this appointment
    const current = await db.query("SELECT vet_id FROM appointments WHERE id = $1", [appointmentId]);
    if (current.rows.length === 0) return res.status(404).json({ error: "Appointment not found" });

    const vetId = current.rows[0].vet_id;

    // checks if there any conflict
    const conflict = await db.query(
      "SELECT * FROM appointments WHERE vet_id = $1 AND date = $2 AND time = $3 AND id != $4",
      [vetId, date, time, appointmentId]
    );

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: "Selected time slot already booked" });
    }

    // Update the appointment
    await db.query(
      "UPDATE appointments SET date = $1, time = $2 WHERE id = $3",
      [date, time, appointmentId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// PATCH pet details (For updating the pet details)
app.patch("/api/pets/:id", async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No fields provided" });
  }

  const updates = [];
  const values = [];
  let count = 1;

  for (const key in fields) {
    updates.push(`${key} = $${count}`);
    values.push(fields[key]);
    count++;
  }

  values.push(id); 

  const query = `UPDATE pets SET ${updates.join(", ")} WHERE id = $${count}`;

  try {
    await db.query(query, values);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(500).json({ error: "Failed to update pet" });
  }
});

//  LOST & FOUND REPORT (POST)
app.post("/api/lost-found", upload.single("photo"), async (req, res) => {
  const { pet_name, details, location, status, reporter_id } = req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      `INSERT INTO lost_found 
      (pet_name, details, photo_url, status, location, reporter_id)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [pet_name, details, photo_url, status, location, reporter_id]
    );
    res.json({ success: true, message: "Report submitted successfully" });
  } catch (err) {
    console.error("Lost Report Error:", err);
    res.status(500).json({ success: false, message: "Failed to submit report" });
  }
});

//  this is for  all lost or found pets based on user location for initially automatically giving the lost pets near him
//  Distinct lost locations (for search dropdown)
app.get('/api/lost-found/locations', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT location FROM lost_found WHERE status = 'lost'"
    );
    res.json(result.rows.map(r => r.location));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

//  List LOST pets by location
app.get('/api/lost-found/lost', async (req, res) => {
  const { location } = req.query;
  try {
    const result = await db.query(
      "SELECT * FROM lost_found WHERE status = 'lost' AND location = $1 ORDER BY reported_at DESC",
      [location]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lost pets" });
  }
});

// List FOUND pets by location & optional name
app.get('/api/lost-found/found', async (req, res) => {
  const { location, pet_name } = req.query;
  let query = "SELECT * FROM lost_found WHERE status = 'found' AND location = $1";
  const vals = [location];
  if (pet_name) {
    vals.push(`%${pet_name}%`);
    query += ` AND LOWER(pet_name) LIKE LOWER($${vals.length})`;
  }
  query += " ORDER BY reported_at DESC";
  try {
    const result = await db.query(query, vals);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch found pets" });
  }
});

// Get a single Lost/Found post + reporter info
app.get('/api/lost-found/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT lf.*,
              u.name AS reporter_name,
              u.email AS reporter_email,
              u.phone AS reporter_phone
       FROM lost_found lf
       JOIN users u ON lf.reporter_id = u.id
       WHERE lf.id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch post details" });
  }
});

//  Get comments for a post
app.get('/api/lost-comments/:lostId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT lc.*, u.name AS commenter_name
       FROM lost_comments lc
       JOIN users u ON lc.commenter_id = u.id
       WHERE lc.lost_id = $1
       ORDER BY lc.commented_at`,
      [req.params.lostId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

//  Post a new comment
app.post('/api/lost-comments', async (req, res) => {
  const { lostId, commenterId, comment } = req.body;
  try {
    await db.query(
      "INSERT INTO lost_comments (lost_id, commenter_id, comment) VALUES ($1, $2, $3)",
      [lostId, commenterId, comment]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// this is if we used the api (currently not working )
app.get("/api/pet-names", async (req, res) => {
  const { gender = "all", search = "" } = req.query;

  let endpoint;
  if (gender.toLowerCase() === "male") endpoint = "male-pet-names";
  else if (gender.toLowerCase() === "female") endpoint = "female-pet-names";
  else endpoint = "all-pet-names";

  try {
    const response = await axios.get(
      `https://${process.env.PET_NAME_HOST}/${endpoint}`,
      {
        params: { search },
        headers: {
          "X-RapidAPI-Key": process.env.PET_NAME_API_KEY,
          "X-RapidAPI-Host": process.env.PET_NAME_HOST,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Pet-name API error:", err.message);
    res.status(500).json({ error: "Failed to fetch pet names" });
  }
});
// GET a single random pet name
app.get("/api/pet-names/random", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT name FROM pet_names ORDER BY RANDOM() LIMIT 1"
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No pet names found" });
    }
    res.json({ name: result.rows[0].name });
  } catch (err) {
    console.error("Failed to fetch pet name:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Runs every hour, at minute 0 (THis is for mailing for remainder for the user about appointment)
//used cron and nodemailer
async function sendAppointmentReminders() {
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
      // Format the appointment timestamp
      const when = new Date(
        `${appt.date.toISOString().slice(0,10)}T${appt.time}`
      ).toLocaleString();

      // Prepare email
      const mailOptions = {
        from: `"PawPath" <${process.env.SMTP_USER}>`,
        to: appt.email,
        subject: `Reminder: Appointment in ${LEAD_HOURS} hours`,
        text: `Hi ${appt.user_name},\n\n` +
              `Just a friendly reminder: you have an appointment with Dr. ${appt.vet_name} on ${when}.\n\n` +
              `See you soon!\n— PawPath`
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`📧 Reminder sent to ${appt.email} for appt ${appt.id}`);

      // Mark as sent
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
}


cron.schedule('0 * * * *', sendAppointmentReminders);


// Save a Contact Us message
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    await db.query(
      `INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)`,
      [name, email, message]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


//  top 5 recent reviews
app.get('/api/reviews/top5', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT rv.id, rv.rating, rv.comment, u.name AS username
         FROM reviews rv
         JOIN users u ON rv.user_id = u.id
        ORDER BY rv.created_at DESC
        LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch top5 reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  All reviews (When clicked show all reviews)
app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT rv.id, rv.rating, rv.comment, u.name AS username, rv.created_at
         FROM reviews rv
         JOIN users u ON rv.user_id = u.id
        ORDER BY rv.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch all reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Submit a new review (When pressed rate us)
app.post('/api/reviews', async (req, res) => {
  const { userId, rating, comment } = req.body;
  if (!userId || !rating || !comment) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }
  try {
    await db.query(
      `INSERT INTO reviews (user_id, target_type, target_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'website', 0, rating, comment]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to submit review:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


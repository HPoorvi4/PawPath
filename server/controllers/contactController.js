import db from "../config/database.js";

// Save a Contact Us message
export const saveContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
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
};

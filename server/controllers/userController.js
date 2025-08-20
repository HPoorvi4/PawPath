import db from "../config/database.js";

// Get user by ID
export const getUserById = async (req, res) => {
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
};

// Update user profile
export const updateUser = async (req, res) => {
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
};

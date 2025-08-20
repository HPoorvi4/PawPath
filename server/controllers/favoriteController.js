import db from "../config/database.js";

// Add to favorites
export const addToFavorites = async (req, res) => {
  const { userId, petId } = req.body;
  try {
    await db.query(
      "INSERT INTO favorites (user_id, pet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, petId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to add to favorites" });
  }
};

// Get favorite pets for a user
export const getFavorites = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT p.*
      FROM favorites f
      JOIN pets p ON f.pet_id = p.id
      WHERE f.user_id = $1
    `,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching favorite pets:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

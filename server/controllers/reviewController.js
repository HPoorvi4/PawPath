import db from "../config/database.js";

// Get top 5 recent reviews
export const getTop5Reviews = async (req, res) => {
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
};

// Get all reviews
export const getAllReviews = async (req, res) => {
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
};

// Submit a new review
export const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  if (!userId || !rating || !comment) {
    return res
      .status(400)
      .json({ success: false, error: "All fields required" });
  }
  try {
    await db.query(
      `INSERT INTO reviews (user_id, target_type, target_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, "website", 0, rating, comment]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to submit review:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

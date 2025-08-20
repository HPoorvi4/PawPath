import db from "../config/database.js";

// Get vet details by location and availability date
export const getVets = async (req, res) => {
  const { location, date } = req.query;
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  try {
    const result = await db.query(
      `SELECT * FROM vets WHERE location = $1 AND available_days ILIKE '%' || $2 || '%'`,
      [location, dayName]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vets" });
  }
};

// Get vet by ID
export const getVetById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM vets WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vet" });
  }
};

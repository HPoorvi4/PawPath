import db from "../config/database.js";

// Adopt a pet
export const adoptPet = async (req, res) => {
  const { userId, petId } = req.body;
  try {
    const pet = await db.query("SELECT is_adopted FROM pets WHERE id = $1", [
      petId,
    ]);
    if (pet.rows[0].is_adopted)
      return res.status(400).json({ msg: "Already adopted" });

    await db.query("INSERT INTO adoptions (user_id, pet_id) VALUES ($1, $2)", [
      userId,
      petId,
    ]);
    await db.query("UPDATE pets SET is_adopted = true WHERE id = $1", [petId]);

    res.json({ msg: "Adopted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get adopted pets for a user
export const getAdoptions = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT p.*, a.adopted_at
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.id
      WHERE a.user_id = $1
    `,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching adopted pets:", err);
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
};

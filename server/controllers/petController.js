import db from "../config/database.js";

// Listing of a pet
export const createPet = async (req, res) => {
  const { name, species, breed, age, gender, description, location, owner_id } =
    req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      `INSERT INTO pets 
      (name, species, breed, age, gender, description, location, photo_url, owner_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        name,
        species,
        breed,
        age,
        gender,
        description,
        location,
        photo_url,
        owner_id,
      ]
    );
    res.json({ success: true, message: "Pet listed successfully" });
  } catch (err) {
    console.error("Error listing pet:", err);
    res.status(500).json({ success: false, message: "Error listing pet" });
  }
};

// Get dropdown options
export const getDropdowns = async (req, res) => {
  try {
    const speciesRes = await db.query(
      "SELECT DISTINCT species FROM pets WHERE is_adopted = false"
    );
    const breedRes = await db.query(
      "SELECT DISTINCT breed FROM pets WHERE is_adopted = false"
    );
    const genderRes = await db.query(
      "SELECT DISTINCT gender FROM pets WHERE is_adopted = false"
    );
    const locationRes = await db.query(
      "SELECT DISTINCT location FROM pets WHERE is_adopted = false"
    );

    res.json({
      species: speciesRes.rows.map((r) => r.species),
      breed: breedRes.rows.map((r) => r.breed),
      gender: genderRes.rows.map((r) => r.gender),
      location: locationRes.rows.map((r) => r.location),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dropdown data" });
  }
};

// Get pets with filters
export const getPets = async (req, res) => {
  const { species, breed, gender, location } = req.query;
  try {
    let query = "SELECT * FROM pets WHERE is_adopted = false";
    const values = [];

    if (species) {
      values.push(species);
      query += ` AND species = $${values.length}`;
    }
    if (breed) {
      values.push(breed);
      query += ` AND breed = $${values.length}`;
    }
    if (gender) {
      values.push(gender);
      query += ` AND gender = $${values.length}`;
    }
    if (location) {
      values.push(location);
      query += ` AND location = $${values.length}`;
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
};

// Get nearby pets
export const getNearbyPets = async (req, res) => {
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
};

// Get pet details
export const getPetById = async (req, res) => {
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
};

// Get listed pets by user
export const getListedPets = async (req, res) => {
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
};

// Delete pet
export const deletePet = async (req, res) => {
  try {
    await db.query("DELETE FROM pets WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({ error: "Failed to delete pet" });
  }
};

// Update pet details
export const updatePet = async (req, res) => {
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
};

import db from "../config/database.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Get pet names from API (currently not working)
export const getPetNamesFromAPI = async (req, res) => {
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
};

// Get a single random pet name from database
export const getRandomPetName = async (req, res) => {
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
};

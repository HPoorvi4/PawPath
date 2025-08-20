import db from "../config/database.js";

// Create lost & found report
export const createLostFoundReport = async (req, res) => {
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
    res
      .status(500)
      .json({ success: false, message: "Failed to submit report" });
  }
};

// Get distinct lost locations
export const getLostLocations = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT location FROM lost_found WHERE status = 'lost'"
    );
    res.json(result.rows.map((r) => r.location));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Get lost pets by location
export const getLostPets = async (req, res) => {
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
};

// Get found pets by location & optional name
export const getFoundPets = async (req, res) => {
  const { location, pet_name } = req.query;
  let query =
    "SELECT * FROM lost_found WHERE status = 'found' AND location = $1";
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
};

// Get single lost/found post + reporter info
export const getLostFoundById = async (req, res) => {
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
};

// Get comments for a post
export const getComments = async (req, res) => {
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
};

// Post a new comment
export const postComment = async (req, res) => {
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
};

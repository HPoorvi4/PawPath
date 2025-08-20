import db from "../config/database.js";

// Registration
export const register = async (req, res) => {
  const { name, email, password, phone, location } = req.body;
  try {
    const exists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
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
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.json({ success: false, message: "User not found" });

    if (user.rows[0].password !== password)
      return res.json({ success: false, message: "Wrong password" });

    res.json({ success: true, userId: user.rows[0].id });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Login error" });
  }
};

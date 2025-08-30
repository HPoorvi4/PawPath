import db from "../config/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUser = await db.query(
      "INSERT INTO users (name, email, password, phone, location) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, hashedPassword, phone, location]
    );

    const userId = insertUser.rows[0].id;

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ success: true, userId, token });
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

    // Compare hashed password
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isValidPassword)
      return res.json({ success: false, message: "Wrong password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ success: true, userId: user.rows[0].id, token });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Login error" });
  }
};

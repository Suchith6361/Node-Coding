import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Role Middleware
export const checkRole = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user only by email
    const query = "SELECT * FROM users WHERE email = ?";

    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
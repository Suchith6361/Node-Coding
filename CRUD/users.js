const express = require("express");
const app = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Signup Route */
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (email,password,role) VALUES (?,?,?)";

    await db.query(query, [email, hashedPassword, role]);

    res.json({
      message: "User registered successfully",
      user: { email, role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Role Middleware */
async function checkRole(req, res, next) {
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
}

function verifyToken(req, res, next) {
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
}

/* Signin Route */
app.post("/signin", checkRole, (req, res) => {
  const token = jwt.sign(
    {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  if (req.user.role === "admin") {
    return res.json({
      message: "Welcome Admin! You have full access.",
      token,
    });
  }

  if (req.user.role === "manager") {
    return res.json({
      message: "Welcome Manager! You have limited access.",
      token,
    });
  }

  res.json({
    message: "Unknown role",
    token,
  });
});

app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
});

app.get("/users", async (req, res) => {
  try {
    const query = "SELECT id,email,role FROM users";
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route Parameters and Query Parameters
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id; // Route parameter
    const role = req.query.role; // Query parameter

    let query = "SELECT id, email, role FROM users WHERE id = ?";
    let values = [id];

    if (role) {
      query += " AND role = ?";
      values.push(role);
    }

    const [results] = await db.query(query, values);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Body Parameters
app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { email } = req.body;

    const query = "UPDATE users SET email = ? WHERE id = ?";

    await db.query(query, [email, id]);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = "DELETE FROM users WHERE id = ?";

    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

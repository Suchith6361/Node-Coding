import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import signupSchema from "../validation/authValidator.js";

// signup Controller
export const signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate request body
    const { error } = signupSchema.validate({ email, password, role });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (email,password,role) VALUES (?,?,?)";

    await db.query(query, [email, hashedPassword, role]);

    res.json({
      message: "User registered successfully",
      user: { email, role },
    });
  } catch (error) {
    // Global error handling using next() to pass the error to the error handler middleware
    next(error);
  }
};

// signin Controller
export const signin = async (req, res) => {
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
};

// profile Controller
export const profile = async (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
};

//get all users Controller
export const users = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const [[countResult]] = await db.query(
      "SELECT COUNT(*) AS total FROM users",
    );

    const totalUsers = countResult.total;

    const [results] = await db.query(
      "SELECT id,email,role FROM users LIMIT ? OFFSET ?",[limit, offset]
    );

    res.json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// get user by id Controller
export const getUserById = async (req, res) => {
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
};

// update user by id Controller
export const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { email } = req.body;

    const query = "UPDATE users SET email = ? WHERE id = ?";

    await db.query(query, [email, id]);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete user by id Controller
export const deleteUserById = async (req, res) => {
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
};

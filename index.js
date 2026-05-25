import express from "express";
import dotenv from "dotenv";
import errorHandler from "./Middleware/errorHandler.js";

import Logger from "./Middleware/logger.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(Logger);

app.use("/api", userRoutes);

// GLOBAL ERROR HANDLER MUST BE LAST
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello Welcome to Express.js! This is the home page.");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/user", (req, res) => {
  res.json({
    id: 1,
    name: "Suchith",
    role: "Developer",
  });
});

app.post("/NewUser", (req, res) => {
  const { name, role, age } = req.body;
  console.log({ name, role, age });
  res.status(201).json({
    message: "User Created successfully",
    user: { name, role, age },
  });
});

/* Fake database */
// const users = [];

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const express = require("express");
const app = express();
const db = require("./database/db");
require("dotenv").config();

const userRoutes = require("./CRUD/users");

app.use(express.json());
app.use(Logger); // middleware first

app.use("/api", userRoutes); // Mount the user routes at /api

function Logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

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

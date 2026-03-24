const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Welcome to Express.js! This is the home page.");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/api/user", (req, res) => {
  res.json({
    id: 1,
    name: "Suchith",
    role: "Developer",
  });
});

app.post("/NewUser", (req, res) => {
  const {name,role,age} = req.body;
  console.log({name,role,age});
  res.status(201).json({
    message: "User Created successfully",
    user: {name,role,age},
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

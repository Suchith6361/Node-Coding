const express = require("express");
const app = express();
const db=require("./db");

app.use(express.json());
app.use(Logger);   // middleware first

function Logger(req,res,next){
  console.log(`${req.method} ${req.url}`);
  next(); 
}

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

/* Fake database */
// const users = [];

/* Signup Route */
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const query = "INSERT INTO users (email,password,role) VALUES (?,?,?)";

    const [result] = await db.query(query, [email, password, role]);

    res.json({
      message: "User registered successfully",
      user: { email, role }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Role Middleware */
async function checkRole(req, res, next) {
  try {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";

    const [results] = await db.query(query, [email, password]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.users = results[0];
    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* Signin Route */
app.post("/signin", checkRole, (req, res) => {

  if (req.users.role === "admin") {
    return res.json({
      message: "Welcome Admin! You have full access."
      
    });
  }

  if (req.users.role === "manager") {
    return res.json({
      message: "Welcome Manager! You have limited access."
    });
  }

  res.json({
    message: "Unknown role"
  });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./Middleware/errorHandler.js";
import cors from "cors";
import Logger from "./Middleware/logger.js";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import limiter from "./Middleware/rateLimit.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(Logger);
//app.use(limiter);  only use here when we need to use rate limit for all routes, otherwise use in specific route

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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

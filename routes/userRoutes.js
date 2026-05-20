import express from "express";

const router = express.Router();

import { signup, signin, profile ,users, getUserById, updateUserById, deleteUserById } from "../controller/userController.js";

import { checkRole, verifyToken } from "../Middleware/authMiddleware.js";

router.post("/signup", signup);

router.post("/signin", checkRole, signin);

router.get("/profile", verifyToken, profile);

router.get("/users", users);

router.get("/users/:id", getUserById);

router.post("/users/:id", updateUserById);  

router.delete("/users/:id", deleteUserById);



export default router;

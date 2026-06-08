import express from "express";

const router = express.Router();

import { signup, signin, profile ,users, getUserById, updateUserById, deleteUserById ,filterUsers } from "../controller/userController.js";

import { checkRole, verifyToken } from "../Middleware/authMiddleware.js";

import {isAdmin} from '../Middleware/roleMiddleware.js'

router.post("/signup", signup);

router.post("/signin", checkRole, signin);

router.get("/profile", verifyToken, profile);

router.get("/users",verifyToken,isAdmin, users);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUserById);  

router.delete("/users/:id",verifyToken,isAdmin, deleteUserById);

router.get("/filter-users", filterUsers);



export default router;

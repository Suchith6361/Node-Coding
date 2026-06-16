import express from "express";

const router = express.Router();

import { signup, signin, profile ,users, getUserById, updateUserById, deleteUserById ,filterUsers,sortUsers ,uploadImage} from "../controller/userController.js";

import { checkRole, verifyToken } from "../Middleware/authMiddleware.js";

import {isAdmin} from '../Middleware/roleMiddleware.js'

import multer from '../Middleware/uplaodMiddleware.js'

router.post("/signup", signup);

router.post("/signin", checkRole, signin);

router.get("/profile", verifyToken, profile);

router.get("/users",verifyToken,isAdmin, users);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUserById);  

router.delete("/users/:id",verifyToken,isAdmin, deleteUserById);

router.get("/filter_users", filterUsers);

router.get("/sort_users", sortUsers);

router.post("/upload",multer.single('image'), uploadImage);

export default router;

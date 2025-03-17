import express from "express";
import { getAllUsers, loginUser, postUsers, verifyUserEmail} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUsers);
userRouter.post("/login", loginUser)
userRouter.get("/", getAllUsers)
userRouter.post("/verify-email", verifyUserEmail)

export default userRouter;

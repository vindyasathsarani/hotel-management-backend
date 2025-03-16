import express from "express";
import { getUser, loginUser, postUsers, verifyUserEmail} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUsers);
userRouter.post("/login", loginUser)
userRouter.get("/", getUser)
userRouter.post("/verify-email", verifyUserEmail)

export default userRouter;

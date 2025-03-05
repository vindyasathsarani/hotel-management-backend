import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoutes.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoutes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import categoryRouter from "./routes/categoryRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connectionString = process.env.MONGO_URL;

// **Middleware to Verify Token and Attach User**
app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(); // Allow unauthenticated requests to pass through
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return next(); 
    }

    req.user = decoded; 
    next();
  });
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });


app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);
app.use("/api/category", categoryRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/feedback", feedbackRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

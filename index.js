import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoutes.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoutes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import categoryRouter from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const connectionString =process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token != null) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);
app.use("/api/category", categoryRouter)

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});

import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoutes.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoutes.js";
import jwt from 'jsonwebtoken'

const app = express();

app.use(bodyParser.json());

const connectionString =
  "mongodb+srv://tester:123@cluster0.xdoou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use((req, res, next)=>{
  const token = req.header("Autherization")?.replace("Bearer","")
  if(token!=null){
    jwt.verify(token, "secret",(err,decoded)=>{
      if(decoded != null){
        req.user =decoded
        next()
      }else{
        next()
      }
    })
  }else{
    next()
  }
})

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter)

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});

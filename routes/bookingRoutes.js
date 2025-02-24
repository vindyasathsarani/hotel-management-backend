import express from "express";
import {
  createBooking,
  getAllBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getAllBookings);

export default bookingRouter;

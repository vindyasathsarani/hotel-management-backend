import express from "express";
import {
    cancelBooking,
  createBooking,
  getAllBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/user", getUserBookings);
bookingRouter.get("/", getAllBookings);
bookingRouter.put('/:bookingId/cancel', cancelBooking);



export default bookingRouter;

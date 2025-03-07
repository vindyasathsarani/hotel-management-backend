import express from "express";
import {
    cancelBooking,
  completeBooking,
  createBooking,
  getAllBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/user", getUserBookings);
bookingRouter.get("/", getAllBookings);
bookingRouter.put('/:bookingId/cancel', cancelBooking);
bookingRouter.put('/complete/:bookingId', completeBooking)



export default bookingRouter;

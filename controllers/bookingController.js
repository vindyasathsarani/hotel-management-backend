import Booking from "../models/bookingModels.js";
import { isCustomerValid } from "./userControllers.js";
import { isAdminValid } from "./userControllers.js";

export async function createBooking(req, res) {
  try {
    if (!isCustomerValid(req)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }
    const startingId = 1200;

    const count = await Booking.countDocuments({});
    const newId = startingId + count + 1;
    const newBooking = new Booking({
      bookingId: newId,
      roomId: req.body.roomId,
      email: req.user.email,
      start: req.body.start,
      end: req.body.end,
    });

    const result = await newBooking.save();
    res.json({
      message: "Booking created successfully",
      result: result,
    });
  } catch (err) {
    res.json({
      message: "Booking creation failed",
      error: err,
    });
  }
}

export async function getAllBookings(req, res) {
  try {
    if (!isAdminValid(req)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    const result = await Booking.find();
    res.json({
      bookings: result,
    });
  } catch (err) {
    res.json({
      message: "Failed to retrieve bookings",
      error: err,
    });
  }
}


export function retriveBookinByDate(req, res){
  const start = req.body.start
  const end = req.body.end

  
  Booking.find({
    start: {
      $gte : new Date(start)
    },
    end: {
      $lte: new Date(end)
    }
  }).then(
    (result)=>{
      res.json(
        {
          message: "Filtered bookings",
          result: result
        }
      )
    }
  ).catch((err)=>{
    res.json(
      {
        message: "Failed to get filtered bookings",
        error: err
      }
    )
  })
}

export async function cancelBooking(req, res) {
  try {
    if (!isAdminValid(req)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    const bookingId = req.params.bookingId;
    const result = await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      { status: "cancelled" },
      { new: true } 
    );

    if (!result) {
      res.status(404).json({
        message: "Booking not found",
      });
      return;
    }

    res.json({
      message: "Booking cancelled successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Booking cancellation failed",
      error: err,
    });
  }
}

export async function getUserBookings(req, res) {
  try {
    if (!isCustomerValid(req)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    const result = await Booking.find({ email: req.user.email });
    res.json({
      bookings: result,
    });
  } catch (err) {
    res.json({
      message: "Failed to retrieve bookings",
      error: err,
    });
  }
}

export async function completeBooking(req, res) {
  try {
    // Check if the user is an admin
    if (!isAdminValid(req)) {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }

    const bookingId = req.params.bookingId;

    // Find the booking with status 'pending'
    const booking = await Booking.findOne({ bookingId: bookingId, status: 'pending' });

    // If booking is not found or already completed
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or not in 'pending' status.",
      });
    }

    // Update the booking status to 'completed'
    booking.status = 'completed';
    await booking.save();

    res.json({
      message: "Booking status updated to 'completed'",
      result: booking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating booking status",
      error: err.message,
    });
  }
}

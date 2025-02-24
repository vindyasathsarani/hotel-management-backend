import Booking from "../models/bookingModels.js";
import { isCustomerValid } from "./userControllers.js";
import { isAdminValid } from "./userControllers.js";

export function createBooking(req, res) {
  if (!isCustomerValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const startingId = 1200;

  Booking.countDocuments({})
    .then((count) => {
      const newId = startingId + count + 1;
      const newBooking = new Booking({
        bookingId: newId,
        roomId: req.body.roomId,
        email: req.user.email,
        start: req.body.start,
        end: req.body.end,
      });
      newBooking
        .save()
        .then((result) => {
          res.json({
            message: "Booking created successfully",
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            message: "Booking creation failed",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.json({
        message: "Booking creation failed",
        error: err,
      });
    });
}

export function getAllBookings(req, res) {
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  Booking.find()
    .then((result) => {
      res.json({
        bookings: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Failed to retrieve bookings",
        error: err,
      });
    });
}

export function cancelBooking(req, res) {
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const bookingId = req.params.bookingId;

  Booking.findOneAndUpdate(
    { bookingId: bookingId },
    { status: "cancelled" },
    { new: true } // Ensure the updated document is returned
  )
    .then((result) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        message: "Booking cancellation failed",
        error: err,
      });
    });
}


export function getUserBookings(req, res) {
  if (!isCustomerValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  Booking.find({ email: req.user.email })
    .then((result) => {
      res.json({
        bookings: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Failed to retrieve bookings",
        error: err,
      });
    });
}
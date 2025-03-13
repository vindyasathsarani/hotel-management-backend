import Feedback from '../models/feedbackModels.js';
import Booking from '../models/bookingModels.js';
import { isCustomerValid } from './userControllers.js';

export const createFeedback = async (req, res) => {
  try {
    if (!isCustomerValid(req)) {
      return res.status(403).json({ message: 'Access denied: Customers only.' });
    }

    const bookingId = Number(req.body.bookingId); // Ensure number format
    const { rating, title, comment, photos } = req.body;

    if (!bookingId || !rating || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    console.log("🔍 Checking booking details for ID:", bookingId);
    console.log("🔍 Checking email:", req.user.email);

    // Find booking with exact email and completed status
    const booking = await Booking.findOne({
      bookingId: bookingId,
      email: req.user.email,
      status: { $regex: /^completed$/, $options: "i" }, // Case-insensitive check
    });

    if (!booking) {
      console.log("❌ Booking not found or not completed");
      return res.status(404).json({ message: 'Booking not found or not eligible for feedback.' });
    }

    console.log("✅ Booking Found:", booking);

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ bookingId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this booking.' });
    }

    // Create feedback
    const feedback = new Feedback({
      userId: req.user._id,
      roomId: booking.roomId,
      bookingId,
      rating,
      title,
      comment,
      photos,
    });

    await feedback.save();
    console.log("✅ Feedback submitted successfully");

    return res.status(201).json({
      message: 'Feedback submitted successfully and is pending approval.',
      feedback,
    });

  } catch (error) {
    console.error("❌ Error in createFeedback:", error);
    return res.status(500).json({
      message: 'An error occurred while submitting feedback.',
      error: error.message,
    });
  }
};

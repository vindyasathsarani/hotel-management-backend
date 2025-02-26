import Feedback from '../models/feedbackModels.js';
import Booking from '../models/bookingModels.js';
import { isCustomerValid, isAdminValid } from './userControllers.js';


export const createFeedback = async (req, res) => {
  try {
   
    if (!isCustomerValid(req)) {
      return res.status(403).json({ message: 'Access denied: Customers only.' });
    }

    const { bookingId, rating, title, comment, photos } = req.body;

    
    if (!bookingId || !rating || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the booking exists, belongs to the user, and is completed
    const booking = await Booking.findOne({
      bookingId,
      email: req.user.email,
      status: 'completed',
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not eligible for feedback.' });
    }

    // Check if feedback already exists for this booking
    const existingFeedback = await Feedback.findOne({ bookingId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this booking.' });
    }

    
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

    res.status(201).json({
      message: 'Feedback submitted successfully and is pending approval.',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while submitting feedback.', error: error.message });
  }
};

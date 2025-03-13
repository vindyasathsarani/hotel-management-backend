import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  roomId: {
    type: Number,
    ref: 'Room', 
    required: true,
  },
  bookingId: {
    type: Number,
    ref: 'Booking', 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, 
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, 
  }, 
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000, 
  },
  photos: [
    {
      url: { type: String, required: true },
      caption: { type: String, trim: true, maxlength: 500 },
    },
  ],
  
  isApproved: {
    type: Boolean,
    default: false, 
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  approvedAt: {
    type: Date,
    default: null, 
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true, 
});

feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['An entire place', 'Room(s)', 'A Shared Room'],
    required: true
  },
  streetAddress: String,
  aptSuite: String,
  city: {
    type: String,
    required: true
  },
  province: String,
  country: {
    type: String,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  bedroomCount: {
    type: Number,
    required: true,
    min: 0
  },
  bedCount: {
    type: Number,
    required: true,
    min: 0
  },
  bathroomCount: {
    type: Number,
    required: true,
    min: 0
  },
  amenities: {
    type: [String],
    default: []
  },
  listingPhotoPaths: {
    type: [String],
    default: []
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  highlight: String,
  highlightDesc: String,
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);

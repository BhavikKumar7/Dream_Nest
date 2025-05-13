const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: "Start date must be in the future"
    }
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.startDate;
      },
      message: "End date must be after start date"
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price must be a positive number"]
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

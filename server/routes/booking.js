const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");

router.post("/create", async (req, res) => {
  try {
    const { customerId, listingId, startDate, endDate, totalPrice } = req.body;

    if (!customerId || !listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        message: "Missing required booking fields.",
        received: req.body,
      });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    
    const hostId = listing.creator; 

    const newBooking = new Booking({
      customerId,
      hostId, 
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await newBooking.save();

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    customer.tripList.push(savedBooking._id);
    await customer.save();

    res.status(200).json(savedBooking);
  } catch (err) {
    console.error("Booking creation failed:", err.message);
    res.status(500).json({ message: "Could not create booking.", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customerId hostId listingId");
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetching bookings failed:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings.", error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ customerId: userId }).populate("listingId");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetching user bookings failed:", err.message);
    res.status(500).json({ message: "Failed to fetch user bookings.", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await User.findByIdAndUpdate(
      booking.customerId,
      { $pull: { tripList: booking._id } }
    );

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (err) {
    console.error("Booking deletion failed:", err.message);
    res.status(500).json({ message: "Failed to delete booking.", error: err.message });
  }
});

module.exports = router;
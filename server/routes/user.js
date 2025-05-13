const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({
        path: "tripList",
        populate: {
          path: "listingId",
        },
      })
      .populate({
        path: "tripList",
        populate: {
          path: "hostId",
          select: "name email",
        },
      });

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json(user.tripList);
  } catch (err) {
    res.status(500).json({ message: "Cannot find trips!", error: err.message });
  }
});

router.delete("/:userId/trips/:tripId", async (req, res) => {
  try {
    const { userId, tripId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const originalLength = user.tripList.length;
    user.tripList = user.tripList.filter((trip) => trip.id !== tripId);
    const bookingDeleted = await Booking.findOneAndDelete({ _id: tripId });

    if (user.tripList.length === originalLength) {
      return res.status(404).json({ message: "Trip not found or already cancelled." });
    }

    await user.save();

    res.status(200).json({ message: "Trip cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId);

    if (!user) return res.status(404).json({ message: "User not found!" });
    if (!listing) return res.status(404).json({ message: "Listing not found!" });

    const index = user.wishList.findIndex((id) => id.toString() === listingId);

    if (index > -1) {
      user.wishList.splice(index, 1);
    } else {
      user.wishList.push(listing._id);
    }

    await user.save();
    await user.populate("wishList");

    res.status(200).json({ message: "Wishlist updated!", wishList: user.wishList });
  } catch (err) {
    console.error("Wishlist update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params;
    const listings = await Listing.find({ creator: userId });

    if (!listings.length) {
      return res.status(404).json({ message: "No properties found for this user." });
    }

    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Cannot find properties!", error: err.message });
  }
});

router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ hostId: userId })
      .populate("listingId")
      .populate({ path: "customerId", select: "name email" });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No reservations found." });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Reservations route error:", err.message);
    res.status(500).json({ message: "Cannot find reservations!", error: err.message });
  }
});

router.get("/:userId/wishlist", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });

    const listings = await Listing.find({ _id: { $in: user.wishList } });

    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching wishlist:", err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

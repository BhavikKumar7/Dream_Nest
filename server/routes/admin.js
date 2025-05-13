const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

router.get("/users/:id/bookings", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await Booking.find({ customerId: userId }).populate("listingId");
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      bookings,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

router.get("/hosts", async (req, res) => {
  try {
    const hosts = await User.find({ role: "host" });
    res.status(200).json(hosts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load hosts", error: err.message });
  }
});

router.delete("/hosts/:id", async (req, res) => {
  try {
    const hostId = req.params.id;

    await User.findByIdAndDelete(hostId);
    await Listing.deleteMany({ hostId });

    res.status(200).json({ message: "Host and their listings deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete host", error: err.message });
  }
});

router.get("/hosts/:id/listings", async (req, res) => {
  try {
    const hostId = req.params.id;
    const host = await User.findById(hostId);

    if (!host) return res.status(404).json({ message: "User not found" });
    if (host.role !== "host") return res.status(403).json({ message: "User is not a host" });

    const listings = await Listing.find({ creator: hostId });

    res.status(200).json({
      host: {
        id: host._id,
        firstName: host.firstName,
        lastName: host.lastName,
        email: host.email,
        role: host.role,
      },
      listings,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
  }
});


module.exports = router;

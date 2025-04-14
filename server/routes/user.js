const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const { saveData, loadData } = require("../data.js");
const { error } = require("console");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;
    const { users, listings } = await loadData();
    const user = users.find((u => u.id === userId));

    console.log(user);
    res.status(200).json(user.tripList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Can not find trips!", error: err.message });
  }
});

router.delete("/:userId/trips/:tripId", async (req, res) => {
  try {
    const { userId, tripId } = req.params;
    const { users, bookings } = await loadData();

    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const originalTripLength = user.tripList?.length || 0;

    user.tripList = user.tripList.filter((trip) => trip.id !== tripId);
    const updatedBookings = bookings.filter((booking) => booking.id !== tripId);

    if (user.tripList.length === originalTripLength) {
      return res.status(404).json({ message: "Trip not found or already cancelled." });
    }

    await saveData({ users, bookings: updatedBookings });

    res.status(200).json({ message: "Trip cancelled successfully!" });
  } catch (err) {
    console.error("Error cancelling trip:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { users, listings } = await loadData();
    const { userId, listingId } = req.params;
    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const listing = listings.find((listing) => listing.id === listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }
    const favoriteListing = user.wishList.find((item) => item.id === listingId);

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item.id !== listingId);
    } else {
      user.wishList.push(listing);
    }

    saveData();

    res.status(200).json({ message: "Wishlist updated!", wishList: user.wishList });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
});

router.get("/:userId/properties", async(req, res) => {
  try {
    const { userId } = req.params;
    const { users, listings } = await loadData();
    const properties = listings.filter((listing) => listing.creator === userId);

    res.status(200).json(properties);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Can not find properties!", error: err.message });
  }
});

router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookings, listings, users } = await loadData();

    // Filter bookings where the host is the user
    const reservations = bookings.filter((booking) => booking.hostId === userId);

    // Optionally enrich the booking data with listing info
    const enrichedReservations = reservations.map((booking) => {
      const listing = listings.find((l) => l.id === booking.listingId);
      const customer = users.find((u) => u.id === booking.customerId);
      return {
        ...booking,
        listing,
        customer: customer ? { id: customer.id, name: customer.name, email: customer.email } : null
      };
    });

    res.status(200).json(enrichedReservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Can not find reservations!", error: err.message });
  }
});


router.get("/", (req, res) => { res.json({ hi: "hi" }) });
module.exports = router;

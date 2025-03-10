const express = require("express");
const router = express.Router();
const { users, listings, bookings, saveData } = require("../data.js");

router.get("/:userId/trips", (req, res) => {
  try {
    const { userId } = req.params;
    const trips = bookings.filter((booking) => booking.customerId === userId);
    const populatedTrips = trips.map((trip) => {
      const listing = listings.find((listing) => listing.id === trip.listingId);
      const host = users.find((user) => user.id === trip.hostId);

      return {
        ...trip,
        listingId: listing,
        hostId: host,
      };
    });

    res.status(200).json(populatedTrips);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Can not find trips!", error: err.message });
  }
});

router.patch("/:userId/:listingId", (req, res) => {
  try {
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

router.get("/:userId/properties", (req, res) => {
  try {
    const { userId } = req.params;
    const properties = listings.filter((listing) => listing.creator === userId);

    res.status(200).json(properties);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Can not find properties!", error: err.message });
  }
});

router.get("/:userId/reservations", (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = bookings.filter((booking) => booking.hostId === userId);

    const populatedReservations = reservations.map((reservation) => {
      const customer = users.find((user) => user.id === reservation.customerId);
      const listing = listings.find((listing) => listing.id === reservation.listingId);

      return {
        ...reservation,
        customerId: customer,
        listingId: listing,
      };
    });

    res.status(200).json(populatedReservations);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Can not find reservations!", error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = require("express").Router();
const { bookings, saveData } = require("../data.js");

router.post("/create", (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    const newBooking = {
      id: generateId(),
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    };

    bookings.push(newBooking);
    res.status(200).json(newBooking);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message });
  }
});

module.exports = router;
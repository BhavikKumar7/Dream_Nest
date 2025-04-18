const express = require("express");
const router = require("express").Router();
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dataFilePath = path.join(__dirname, "../data.json");

const loadData = async () => {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    if (err.code === "ENOENT") {
      const initialData = { users: [], listings: [], bookings: [] };
      await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    } else {
      throw err;
    }
  }
};

const saveData = async (data) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving booking:", err.message);
    throw err;
  }
};

router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        message: "Missing required booking fields.",
        received: req.body,
      });
    }

    const data = await loadData();

    const newBooking = {
      id: uuidv4(),
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    };

    data.bookings.push(newBooking);
    const userIndex = data.users.findIndex((user) => user.id === customerId);
    if (userIndex !== -1) {
      if (!Array.isArray(data.users[userIndex].tripList)) {
        data.users[userIndex].tripList = [];
      }
      data.users[userIndex].tripList.push(newBooking);
    } else {
      console.warn(`User with id ${customerId} not found.`);
    }
    await saveData(data);

    res.status(200).json(newBooking);
  } catch (err) {
    console.error("Booking creation failed:", err.message);
    res.status(500).json({
      message: "Internal Server Error. Could not create booking.",
      error: err.message,
    });
  }
});

module.exports = router;

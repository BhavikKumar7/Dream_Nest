const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "../data.json");

const loadData = async () => {
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data);
};

const saveData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

// Get all users
router.get("/users", async (req, res) => {
  try {
    const data = await loadData();
    res.status(200).json(data.users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", error: err.message });
  }
});

// Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const data = await loadData();
    const userId = req.params.id;

    const updatedUsers = data.users.filter((user) => user.id !== userId);
    data.users = updatedUsers;

    await saveData(data);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

// Get bookings of a specific user
router.get("/users/:id/bookings", async (req, res) => {
  try {
    const data = await loadData();
    const userId = req.params.id;

    const userBookings = data.bookings.filter((b) => b.customerId === userId);
    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

// Get all hosts
router.get("/hosts", async (req, res) => {
    try {
      const data = await loadData();
      const hosts = data.users.filter((user) => user.role === "host");
      res.status(200).json(hosts);
    } catch (err) {
      res.status(500).json({ message: "Failed to load hosts", error: err.message });
    }
  });
  
  // Delete host by ID
  router.delete("/hosts/:id", async (req, res) => {
    try {
      const data = await loadData();
      const hostId = req.params.id;
  
      data.users = data.users.filter((user) => user.id !== hostId);
      data.listings = data.listings.filter((listing) => listing.creator.id !== hostId); // Optional: remove host listings
  
      await saveData(data);
      res.status(200).json({ message: "Host deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete host", error: err.message });
    }
  });
  
  // Get listings of a specific host
  router.get("/hosts/:id/listings", async (req, res) => {
    try {
      const data = await loadData();
      const hostId = req.params.id;
  
      const listings = data.listings.filter((listing) => listing.creator.id === hostId);
      res.status(200).json(listings);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch listings", error: err.message });
    }
  });
  

module.exports = router;

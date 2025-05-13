const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Listing = require("../models/Listing");
const path = require("path");

const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos) return res.status(400).send("No file uploaded.");

    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities: JSON.parse(amenities),
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    // Validate creator
    if (!creator || !mongoose.Types.ObjectId.isValid(creator)) {
      return res.status(400).json({ message: "Invalid or missing creator ID." });
    }

    // Validate type
    const validTypes = ['An entire place', 'Room(s)', 'A Shared Room'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid listing type. Allowed types: ${validTypes.join(", ")}` });
    }

    await newListing.save();
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    res.status(409).json({ message: "Failed to create listing", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const qCategory = req.query.category;
    const listings = qCategory
      ? await Listing.find({ category: qCategory })
      : await Listing.find();

    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({ message: "Failed to fetch listings", error: err.message });
  }
});

router.get("/search/:search", async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, "i");

    const listings = search === "all"
      ? await Listing.find()
      : await Listing.find({
        $or: [{ category: regex }, { title: regex }],
      });

    if (listings.length === 0) {
      return res.status(404).json({ message: "No listings found matching the search criteria" });
    }

    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({ message: "Failed to search listings", error: err.message });
  }
});

router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving listing details", error: err.message });
  }
});

router.put("/:id", upload.array("newPhotos", 10), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
      existingPhotos,
    } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found!" });

    const newPhotoPaths = req.files.map((file) => file.path);
    const combinedPhotos = [...JSON.parse(existingPhotos || "[]"), ...newPhotoPaths];

    Object.assign(listing, {
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount: parseInt(guestCount),
      bedroomCount: parseInt(bedroomCount),
      bedCount: parseInt(bedCount),
      bathroomCount: parseInt(bathroomCount),
      amenities: JSON.parse(amenities),
      title,
      description,
      highlight,
      highlightDesc,
      price: parseFloat(price),
      listingPhotoPaths: combinedPhotos,
    });

    await listing.save();
    res.status(200).json({ message: "Listing updated successfully!", listing });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Listing not found" });

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing", error: err.message });
  }
});

module.exports = router;

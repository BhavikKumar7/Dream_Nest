const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const { saveData, loadData } = require("../data.js");
const fs = require("fs");
const {v4 : uuidv4} = require('uuid');
const path = require('path');

function updateJsonData(payload){
  fs.readFile("./data.json", "utf8", (err,data)=>{
    if(err){
      console.log("error while updating data" ,err);
      return;
    }
    try{
      let det = JSON.parse(data);
      console.log("fetched data" + det);
      det.listings.push(payload);

      fs.writeFile("./data.json", JSON.stringify(det, null, 2), "utf8", (err)=>{
        if(err){
          console.log("error while writing the data");
          return;
        }
        console.log("data written successfully");
      })


    }catch(err){
      console.log("error while assigning data");
    }
  })
}

function getData(){
  const data = fs.readFileSync("./data.json", "utf8");
  return JSON.parse(data);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/create", upload.array("listingPhotos"), (req, res) => {
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

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.");
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListing = {
      id: uuidv4(),
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
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    };

    updateJsonData(newListing);
    const updatedListings = getData().listings;
    res.status(200).json(updatedListings);
  } catch (err) {
    res.status(409).json({ message: "Fail to create Listing", error: err.message });
    console.log(err);
  }
});

router.get("/", (req, res) => {
  const qCategory = req.query.category;

  try {
    const listings = getData().listings;
    let filteredListings = listings;
    if (qCategory) {
      filteredListings = listings.filter((listing) => listing.category === qCategory);
    }

    res.status(200).json(filteredListings);
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

router.get("/search/:search", (req, res) => {
  const { search } = req.params;
  console.log("Search term:", search);
  try {
    const listings = getData().listings;
    if (search === "all") {
      return res.status(200).json(listings);
    }
    let filteredListings = listings.filter(
      (listing) =>
        listing.category.toLowerCase().includes(search.toLowerCase()) ||
        listing.title.toLowerCase().includes(search.toLowerCase())
    );

    console.log("Filtered Listings:", filteredListings);  // Debugging

    // If no listings are found, return a meaningful message
    if (filteredListings.length === 0) {
      return res.status(404).json({ message: "No listings found matching the search criteria" });
    }

    res.status(200).json(filteredListings);
  } catch (err) {
    console.error("Error in search:", err);  // Debugging
    res.status(404).json({ message: "Failed to fetch listings", error: err.message });
  }
});


router.get("/:listingId", (req, res) => {
  try {
    const { listingId } = req.params;
    const allData = getData();
    const listings = allData.listings;
    const users = allData.users;

    const listing = listings.find((listing) => listing.id === listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }

    const hostUser = users.find((user) => user.id === listing.creator);

    const populatedListing = {
      ...listing,
      creator: hostUser
        ? {
            id: hostUser.id,
            firstName: hostUser.firstName,
            lastName: hostUser.lastName,
            profileImagePath: hostUser.profileImagePath,
          }
        : {
            firstName: "Unknown",
            lastName: "Host",
            profileImagePath: "",
          },
    };

    res.status(200).json(populatedListing);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving listing details",
      error: err.message,
    });
  }
});

router.put("/:id", upload.array("newPhotos", 10), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Listing ID from URL:", id);
    
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

    const { listings } = await loadData();
    console.log("Listings loaded:", listings);

    const listing = listings.find((l) => l.id === id);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }

    listing.category = category;
    listing.type = type;
    listing.streetAddress = streetAddress;
    listing.aptSuite = aptSuite;
    listing.city = city;
    listing.province = province;
    listing.country = country;
    listing.guestCount = parseInt(guestCount);
    listing.bedroomCount = parseInt(bedroomCount);
    listing.bedCount = parseInt(bedCount);
    listing.bathroomCount = parseInt(bathroomCount);
    listing.amenities = JSON.parse(amenities);
    listing.title = title;
    listing.description = description;
    listing.highlight = highlight;
    listing.highlightDesc = highlightDesc;
    listing.price = parseFloat(price);

    const existing = JSON.parse(existingPhotos || "[]");
    const newPhotoPaths = req.files.map((file) => `/uploads/${file.filename}`);
    listing.photoUrls = [...existing, ...newPhotoPaths];
    await saveData({ listings });
    res.status(200).json({ message: "Listing updated successfully!", listing });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data.json:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing data.json:", parseErr);
      return res.status(500).json({ message: "Error parsing data" });
    }

    const listings = jsonData.listings;
    const indexToDelete = listings.findIndex((i) => i.id === id);

    if (indexToDelete === -1) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listings.splice(indexToDelete, 1); // Remove the listing

    fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), "utf8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing data.json:", writeErr);
        return res.status(500).json({ message: "Failed to delete listing" });
      }

      res.status(200).json({ message: "Listing deleted successfully" });
    });
  });
});


module.exports = router;

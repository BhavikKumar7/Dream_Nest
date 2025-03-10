const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const {v4 : uuidv4} = require('uuid');

function updateJsonData(payload){
  fs.readFile("./data.json", "utf8", (err,data)=>{
    if(err){
      console.log("error while updating data" ,err);
      return;
    }
    try{
      let det = JSON.parse(data);
      console.log("fetched data" + det);
      det.listing.push(payload);

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
    const updatedListings = getData().listing;
    res.status(200).json(updatedListings);
  } catch (err) {
    res.status(409).json({ message: "Fail to create Listing", error: err.message });
    console.log(err);
  }
});

router.get("/", (req, res) => {
  const qCategory = req.query.category;

  try {
    const listings = getData().listing;
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

  try {
    const listings = getData().listing;
    let filteredListings = listings;
    if (search !== "all") {
      filteredListings = listings.filter(
        (listing) =>
          listing.category.toLowerCase().includes(search.toLowerCase()) ||
          listing.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(filteredListings);
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

router.get("/:listingId", (req, res) => {
  try {
    const listings = getData().listing;
    const { listingId } = req.params;
    const listing = listings.find((listing) => listing.id === listingId);
    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: "Listing not found!" });
    }
  } catch (err) {
    res.status(404).json({ message: "Listing can not be found!", error: err.message });
  }
});

module.exports = router;
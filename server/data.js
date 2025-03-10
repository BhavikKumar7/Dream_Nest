const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

let users = [];
let listings = [];
let bookings = [];

const loadData = async () => {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);

    if (Array.isArray(data.users)) users = data.users;
    if (Array.isArray(data.listings)) listings = data.listings;
    if (Array.isArray(data.bookings)) bookings = data.bookings;

    console.log("Data loaded successfully.");
  } catch (err) {
    if (err.code === "ENOENT") {
      await saveData();
      console.log("Created new data file with default values.");
    } else {
      console.error("Error loading data from file:", err.message);
    }
  }
};

const saveData = async () => {
  const data = { users, listings, bookings };
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    console.log("Data saved successfully.");
  } catch (err) {
    console.error("Error saving data to file:", err.message);
  }
};

loadData();

module.exports = { users, listings, bookings, saveData };
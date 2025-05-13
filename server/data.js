require("./db");

const User = require("./models/User");
const Listing = require("./models/Listing");
const Booking = require("./models/Booking");

/**
 * Loads all data from MongoDB collections.
 * @returns {Promise<{users: Array, listings: Array, bookings: Array}>}
 */
const loadData = async () => {
  try {
    const users = await User.find({});
    const listings = await Listing.find({});
    const bookings = await Booking.find({});

    console.log("✅ Data loaded from MongoDB.");
    return { users, listings, bookings };
  } catch (err) {
    console.error("❌ Error loading data from MongoDB:", err.message);
    return { users: [], listings: [], bookings: [] };
  }
};

/**
 * Saves given data into MongoDB collections after clearing them.
 * This will remove all existing documents in the collections.
 * @param {{users: Array, listings: Array, bookings: Array}} data
 */
const saveData = async ({ users = [], listings = [], bookings = [] }) => {
  try {
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});

    if (users.length > 0) await User.insertMany(users);
    if (listings.length > 0) await Listing.insertMany(listings);
    if (bookings.length > 0) await Booking.insertMany(bookings);

    console.log("✅ Data saved to MongoDB.");
  } catch (err) {
    console.error("❌ Error saving data to MongoDB:", err.message);
  }
};

module.exports = { loadData, saveData };

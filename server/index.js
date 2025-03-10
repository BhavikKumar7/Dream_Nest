const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
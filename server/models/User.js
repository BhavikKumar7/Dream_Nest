const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, unique: true, required: true },
  password:  { type: String, required: true },
  profileImagePath: String,
  role: {
    type: String,
    enum: ["user", "host", "admin", "guest"],
    default: "user"
  },

  tripList:       [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  wishList:       [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  propertyList:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  reservationList:[{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
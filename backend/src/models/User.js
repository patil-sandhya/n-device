const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // userId: { type: String, unique: true, required: true }, // Auth0 sub
    fullName: { type: String },
    email: { type: String, lowercase: true },
    phone: { type: String },
    sub: {type: String, unique: true}, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

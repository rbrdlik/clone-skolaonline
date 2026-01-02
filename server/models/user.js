const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },

  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+@.+\..+/
  },

  password: { type: String, required: true },

  gender: { type: String, enum: ["muž", "žena"], required: true },
  role: {
    type: String,
    enum: ["student", "učitel", "admin"],
    default: "student"
  },

  date_of_birth: { type: Date, required: true },

  refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

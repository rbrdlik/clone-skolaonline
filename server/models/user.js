const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true},
    email: { type: String, unique: true, required: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, enum: ["muž", "žena"], required: true},
    role: {type: String, enum: ["student", "učitel", "admin"], required: true, default: "student"},
    date_of_birth: {type: Date, required: true}
});

module.exports = mongoose.model("User", userSchema);
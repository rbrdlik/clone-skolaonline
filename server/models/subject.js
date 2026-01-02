const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    short_name: {type: String, required: true},
    teachers: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}]
});

module.exports = mongoose.model("Subject", subjectSchema);
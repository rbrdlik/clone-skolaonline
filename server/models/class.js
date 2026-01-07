const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    name: {type: String, required: true},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}]
});

module.exports = mongoose.model("Class", classSchema);
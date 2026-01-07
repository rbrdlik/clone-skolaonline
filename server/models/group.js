const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true},
    name: {type: String, required: true},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}]
});

module.exports = mongoose.model("Group", groupSchema);
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null},
    group_id: {type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null},
    recipient_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    title: {type: String, required: true},
    content: {type: String, required: true},
    created_at: {type: Date, default: Date.now, required: true}
})

module.exports = mongoose.model("Message", messageSchema);
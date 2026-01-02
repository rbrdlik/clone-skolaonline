const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true},
    dayOfWeek: {type: Number, enum: [1, 2, 3, 4, 5], required: true},
    lessons: [{
        hour: {type: Number, required: true},
        subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true},
        teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        room: {type: String, required: true},
        group_id: {type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null}
    }]
});

module.exports = mongoose.model("Schedule", scheduleSchema);
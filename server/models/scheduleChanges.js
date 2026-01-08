const mongoose = require("mongoose");

const scheduleChangesSchema = new mongoose.Schema({
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true},
    date: {type: Date, default: Date.now, required: true},
    changes: [
        {
            hour: {type: Number, required: true},
            type: {type: String, enum: ["cancel", "change", "note", "room_change"], required: true},
            subject: {type: String, required: true},
            teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
            room: {type: String, default: ""},
            group_id: {type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null},
            grade: {type: mongoose.Schema.Types.ObjectId, ref: "Grade", default: null},
            substitute_teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
            note: {type: String, default: null}
        }
    ]
});

module.exports = mongoose.model("scheduleChanges", scheduleChangesSchema);
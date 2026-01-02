const mongoose = require("mongoose");

const scheduleChangesSchema = new mongoose.Schema({
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true},
    date: {type: Date, default: Date.now, required: true},
    changes: [
        {
            hour: {type: Number, required: true},
            type: {type: String, enum: ["grade", "cancel", "change", "note"], required: true},
            subject: {type: String, required: true},
            teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
            room: {type: String, required: true},
            group_id: {type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null},
            grade: {type: mongoose.Schema.Types.ObjectId, ref: "Grade", default: null},
            substitute_teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
            note: {type: String, default: null}
        }
    ]
});

module.exports = mongoose.model("scheduleChanges", scheduleChangesSchema);
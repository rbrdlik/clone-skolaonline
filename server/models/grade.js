const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    student_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    subject_id: {type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true},
    teacher_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true},
    value: {type: Number, required: true},
    weight: {type: Number, required: true},
    description: {type: String, required: false},
    date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model("Grade", gradeSchema);
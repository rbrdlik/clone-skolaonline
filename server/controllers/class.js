const Class = require("../models/class");
const User = require("../models/user");

exports.getAllClasses = async (req, res) => {
  try {
    const data = await Class.find().populate("students");
    if (data.length)
      return res.status(200).send({ message: "Classes found", payload: data });
    res.status(404).send({ message: "Classes not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getClassById = async (req, res) => {
  try {
    const data = await Class.findById(req.params.id).populate("students");
    if (data)
      return res.status(200).send({ message: "Class found", payload: data });
    res.status(404).send({ message: "Class not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createClass = async (req, res) => {
  try {
    const data = new Class({
      name: req.body.name,
      students: req.body.students || [],
    });
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Class created", payload: result });
    res.status(404).send({ message: "Class not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateClass = async (req, res) => {
  try {
    const result = await Class.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        students: req.body.students || [],
      },
      { new: true }
    );
    if (result)
      return res
        .status(200)
        .send({ message: "Class updated", payload: result });
    res.status(404).send({ message: "Class not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const result = await Class.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Class deleted", payload: result });
    res.status(404).send({ message: "Class not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.addStudentToClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).send({ message: "Class not found" });

    const studentId = req.body.studentId;
    if (!cls.students.includes(studentId)) cls.students.push(studentId);
    await cls.save();

    res.status(200).send({ message: "Student added to class", payload: cls });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).send({ message: "Class not found" });

    const studentId = req.body.studentId;
    cls.students = cls.students.filter((id) => id.toString() !== studentId);
    await cls.save();

    res
      .status(200)
      .send({ message: "Student removed from class", payload: cls });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getClassStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate("students");
    if (!cls) return res.status(404).send({ message: "Class not found" });
    res.status(200).send({ message: "Class students", payload: cls.students });
  } catch (e) {
    res.status(500).send(e);
  }
};

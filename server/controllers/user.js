const User = require("../models/user");
const Class = require("../models/class");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find().select("-password -refreshToken");
    if (data.length)
      return res.status(200).send({ message: "Users found", payload: data });
    res.status(404).send({ message: "Users not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (data)
      return res.status(200).send({ message: "User found", payload: data });
    res.status(404).send({ message: "User not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
    // Hashování hesla před uložením
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    const data = new User({
      ...rest,
      password: hashedPassword,
    });
    const result = await data.save();
    if (result)
      return res.status(201).send({ message: "User created", payload: result });
    res.status(404).send({ message: "User not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
    // Pokud je v requestu heslo, hashujeme ho před uložením
    let updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const result = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (result)
      return res.status(200).send({ message: "User updated", payload: result });
    res.status(404).send({ message: "User not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result)
      return res.status(200).send({ message: "User deleted", payload: result });
    res.status(404).send({ message: "User not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password -refreshToken");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId)
      .populate("students", "first_name last_name email");

    if (!classData) {
      return res.status(404).json({ message: "Třída nenalezena" });
    }

    res.status(200).json(classData.students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentsWithoutClass = async (req, res) => {
  try {
    const classes = await Class.find({}, "students");
    const assignedStudentIds = classes.flatMap(c => c.students);

    const students = await User.find({
      role: "student",
      _id: { $nin: assignedStudentIds }
    }).select("-password -refreshToken");

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "učitel" }).select("-password -refreshToken");
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

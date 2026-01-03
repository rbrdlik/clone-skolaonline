const User = require("../models/user");

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
    const data = new User(req.body);
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
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
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

exports.getStudents = async (req, res) => {
  try {
    const data = await User.find({ role: "student" }).select(
      "-password -refreshToken"
    );
    if (data.length)
      return res.status(200).send({ message: "Students found", payload: data });
    res.status(404).send({ message: "Students not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const data = await User.find({ role: "učitel" }).select(
      "-password -refreshToken"
    );
    if (data.length)
      return res.status(200).send({ message: "Teachers found", payload: data });
    res.status(404).send({ message: "Teachers not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

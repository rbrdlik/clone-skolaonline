const Grade = require("../models/grades");

exports.getAllGrades = async (req, res, next) => {
  try {
    const data = await Grade.find();
    if (data && data.length !== 0) {
      return res.status(200).send({
        message: "Grades found!",
        payload: data,
      });
    }
    res.status(400).send({
      message: "Grades not found!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.getGradeById = async (req, res, next) => {
  try {
    const data = await Grade.findById(req.params.id);
    if (data) {
      return res.status(200).send({
        message: "Grade found!",
        payload: data,
      });
    }
    res.status(400).send({
      message: "Grade not found!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.createGrade = async (req, res, next) => {
  try {
    const data = new Grade({
      studentId: req.body.studentId,
      subject: req.body.subject,
      grade: req.body.grade,
    });
    const result = await data.save();
    if (result) {
      return res.status(201).send({
        message: "Grade created!",
        payload: result,
      });
    }
    res.status(400).send({
      message: "Wrong input!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.updateGrade = async (req, res, next) => {
  try {
    const data = {
      studentId: req.body.studentId,
      subject: req.body.subject,
      grade: req.body.grade,
    };
    const result = await Grade.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Grade updated!",
        payload: result,
      });
    }
    res.status(400).send({
      message: "Wrong input!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.deleteGrade = async (req, res, next) => {
  try {
    const data = {
      studentId: req.body.studentId,
      subject: req.body.subject,
      grade: req.body.grade,
    };
    const result = await Grade.findByIdAndDelete(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Grade deleted!",
        payload: result,
      });
    }
    res.status(400).send({
      message: "Wrong input!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const Grade = require("../models/grade");

exports.createGrade = async (req, res) => {
  try {
    const data = new Grade(req.body);
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Grade created", payload: result });
    res.status(404).send({ message: "Grade not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const result = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (result)
      return res
        .status(200)
        .send({ message: "Grade updated", payload: result });
    res.status(404).send({ message: "Grade not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Grade deleted", payload: result });
    res.status(404).send({ message: "Grade not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getGradesByStudent = async (req, res) => {
  try {
    const data = await Grade.find({
      student_id: req.params.studentId,
    }).populate("student_id subject_id teacher_id class_id");
    if (data.length)
      return res.status(200).send({ message: "Grades found", payload: data });
    res.status(404).send({ message: "Grades not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getGradesByClass = async (req, res) => {
  try {
    const data = await Grade.find({ class_id: req.params.classId }).populate(
      "student_id subject_id teacher_id class_id"
    );
    if (data.length)
      return res.status(200).send({ message: "Grades found", payload: data });
    res.status(404).send({ message: "Grades not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getGradesBySubject = async (req, res) => {
  try {
    const data = await Grade.find({
      subject_id: req.params.subjectId,
    }).populate("student_id subject_id teacher_id class_id");
    if (data.length)
      return res.status(200).send({ message: "Grades found", payload: data });
    res.status(404).send({ message: "Grades not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getStudentAverage = async (req, res) => {
  try {
    const grades = await Grade.find({ student_id: req.params.studentId });
    if (!grades.length)
      return res.status(404).send({ message: "No grades found" });

    const total = grades.reduce((sum, g) => sum + g.value * g.weight, 0);
    const weightSum = grades.reduce((sum, g) => sum + g.weight, 0);
    const average = total / weightSum;

    res
      .status(200)
      .send({ message: "Student average calculated", payload: { average } });
  } catch (e) {
    res.status(500).send(e);
  }
};

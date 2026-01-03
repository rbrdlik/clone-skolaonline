const Subject = require("../models/subject");

exports.getAllSubjects = async (req, res) => {
  try {
    const data = await Subject.find().populate("teachers");
    if (data.length)
      return res.status(200).send({ message: "Subjects found", payload: data });
    res.status(404).send({ message: "Subjects not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const data = await Subject.findById(req.params.id).populate("teachers");
    if (data)
      return res.status(200).send({ message: "Subject found", payload: data });
    res.status(404).send({ message: "Subject not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createSubject = async (req, res) => {
  try {
    const data = new Subject({
      name: req.body.name,
      short_name: req.body.short_name,
      teachers: req.body.teachers || [],
    });
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Subject created", payload: result });
    res.status(404).send({ message: "Subject not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const result = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        short_name: req.body.short_name,
        teachers: req.body.teachers || [],
      },
      { new: true }
    );
    if (result)
      return res
        .status(200)
        .send({ message: "Subject updated", payload: result });
    res.status(404).send({ message: "Subject not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const result = await Subject.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Subject deleted", payload: result });
    res.status(404).send({ message: "Subject not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.assignTeacherToSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send({ message: "Subject not found" });

    const teacherId = req.body.teacherId;
    if (!subject.teachers.includes(teacherId)) subject.teachers.push(teacherId);
    await subject.save();

    res
      .status(200)
      .send({ message: "Teacher assigned to subject", payload: subject });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removeTeacherFromSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send({ message: "Subject not found" });

    const teacherId = req.body.teacherId;
    subject.teachers = subject.teachers.filter(
      (id) => id.toString() !== teacherId
    );
    await subject.save();

    res
      .status(200)
      .send({ message: "Teacher removed from subject", payload: subject });
  } catch (e) {
    res.status(500).send(e);
  }
};

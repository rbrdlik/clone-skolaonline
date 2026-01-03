const Group = require("../models/group");

exports.getGroupsByClass = async (req, res) => {
  try {
    const data = await Group.find({ class_id: req.params.classId }).populate(
      "students class_id"
    );
    if (data.length)
      return res.status(200).send({ message: "Groups found", payload: data });
    res.status(404).send({ message: "Groups not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const data = await Group.findById(req.params.id).populate(
      "students class_id"
    );
    if (data)
      return res.status(200).send({ message: "Group found", payload: data });
    res.status(404).send({ message: "Group not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createGroup = async (req, res) => {
  try {
    const data = new Group({
      name: req.body.name,
      class_id: req.body.class_id,
      students: req.body.students || [],
    });
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Group created", payload: result });
    res.status(404).send({ message: "Group not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const result = await Group.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        class_id: req.body.class_id,
        students: req.body.students || [],
      },
      { new: true }
    );
    if (result)
      return res
        .status(200)
        .send({ message: "Group updated", payload: result });
    res.status(404).send({ message: "Group not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const result = await Group.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Group deleted", payload: result });
    res.status(404).send({ message: "Group not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.addStudentToGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).send({ message: "Group not found" });

    const studentId = req.body.studentId;
    if (!group.students.includes(studentId)) group.students.push(studentId);
    await group.save();

    res.status(200).send({ message: "Student added to group", payload: group });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.removeStudentFromGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).send({ message: "Group not found" });

    const studentId = req.body.studentId;
    group.students = group.students.filter((id) => id.toString() !== studentId);
    await group.save();

    res
      .status(200)
      .send({ message: "Student removed from group", payload: group });
  } catch (e) {
    res.status(500).send(e);
  }
};

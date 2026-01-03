const ScheduleChanges = require("../models/scheduleChanges");

exports.getChangesByClassAndDate = async (req, res) => {
  try {
    const data = await ScheduleChanges.find({
      class_id: req.params.classId,
      date: req.params.date,
    }).populate(
      "class_id changes.teacher changes.grade changes.substitute_teacher changes.group_id"
    );
    if (data.length)
      return res
        .status(200)
        .send({ message: "Schedule changes found", payload: data });
    res.status(404).send({ message: "Schedule changes not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createScheduleChange = async (req, res) => {
  try {
    const data = new ScheduleChanges(req.body);
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Schedule change created", payload: result });
    res.status(404).send({ message: "Schedule change not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateScheduleChange = async (req, res) => {
  try {
    const result = await ScheduleChanges.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (result)
      return res
        .status(200)
        .send({ message: "Schedule change updated", payload: result });
    res.status(404).send({ message: "Schedule change not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteScheduleChange = async (req, res) => {
  try {
    const result = await ScheduleChanges.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Schedule change deleted", payload: result });
    res.status(404).send({ message: "Schedule change not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

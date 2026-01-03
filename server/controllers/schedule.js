const Schedule = require("../models/schedule");

exports.getScheduleByClass = async (req, res) => {
  try {
    const data = await Schedule.find({ class_id: req.params.classId }).populate(
      "class_id lessons.subject lessons.teacher lessons.group_id"
    );
    if (data.length)
      return res.status(200).send({ message: "Schedule found", payload: data });
    res.status(404).send({ message: "Schedule not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const data = new Schedule(req.body);
    const result = await data.save();
    if (result)
      return res
        .status(201)
        .send({ message: "Schedule created", payload: result });
    res.status(404).send({ message: "Schedule not created" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const result = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (result)
      return res
        .status(200)
        .send({ message: "Schedule updated", payload: result });
    res.status(404).send({ message: "Schedule not updated" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const result = await Schedule.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Schedule deleted", payload: result });
    res.status(404).send({ message: "Schedule not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule)
      return res.status(404).send({ message: "Schedule not found" });

    const lessonIndex = schedule.lessons.findIndex(
      (l) => l.hour === req.body.hour
    );
    if (lessonIndex === -1)
      return res.status(404).send({ message: "Lesson not found" });

    schedule.lessons[lessonIndex] = {
      ...schedule.lessons[lessonIndex]._doc,
      ...req.body.lesson,
    };
    await schedule.save();

    res.status(200).send({ message: "Lesson updated", payload: schedule });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule)
      return res.status(404).send({ message: "Schedule not found" });

    schedule.lessons = schedule.lessons.filter((l) => l.hour !== req.body.hour);
    await schedule.save();

    res.status(200).send({ message: "Lesson deleted", payload: schedule });
  } catch (e) {
    res.status(500).send(e);
  }
};

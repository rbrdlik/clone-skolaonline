const Schedule = require("../models/schedule");
const ScheduleChanges = require("../models/scheduleChanges");
const Class = require("../models/class");
const Group = require("../models/group");
const Grade = require("../models/grade");

const getDayOfWeek = (dateString) => {
  const jsDay = new Date(dateString).getDay(); // 0–6 (Ne–So)
  if (jsDay === 0 || jsDay === 6) return null;
  return jsDay; // Po–Pá = 1–5 ✔
};

const applyScheduleChanges = (lessons, changes) => {
  const result = [...lessons];

  changes.forEach(change => {
    const index = result.findIndex(l => l.hour === change.hour);

    if (change.type === "cancel") {
      if (index !== -1) result.splice(index, 1);
    }

    if (change.type === "change") {
      if (index !== -1) {
        result[index] = {
          hour: change.hour,
          subject: change.subject,
          teacher: change.substitute_teacher || change.teacher,
          room: change.room,
          group_id: change.group_id
        };
      }
    }

    if (change.type === "room_change") {
      if (index !== -1) {
        result[index] = {
          ...result[index],
          room: change.room
        };
      }
    }

    if (change.type === "note" && index !== -1) {
      result[index].note = change.note;
    }
  });

  return result.sort((a, b) => a.hour - b.hour);
};

exports.getStudentScheduleForDay = async (req, res) => {
  try {
    const { studentId, date } = req.query;

    const dayOfWeek = getDayOfWeek(date);
    if (!dayOfWeek) return res.status(400).json({ message: "Neplatný den" });

    const studentClass = await Class.findOne({ students: studentId });
    if (!studentClass) return res.status(404).json({ message: "Třída nenalezena" });

    const groups = await Group.find({ students: studentId });
    const groupIds = groups.map(g => g._id.toString());

    const schedule = await Schedule.findOne({
      class_id: studentClass._id,
      dayOfWeek
    })
      .populate("lessons.subject")
      .populate("lessons.teacher");

    if (!schedule) return res.json([]);

    let lessons = schedule.lessons.filter(
      l => !l.group_id || groupIds.includes(l.group_id.toString())
    );

    const changes = await ScheduleChanges.findOne({
      class_id: studentClass._id,
      date: new Date(date)
    });

    if (changes) {
      lessons = applyScheduleChanges(lessons, changes.changes);
    }

    res.status(200).json(lessons);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeacherScheduleForDay = async (req, res) => {
  try {
    const { teacherId, date } = req.query;

    const dayOfWeek = getDayOfWeek(date);
    if (!dayOfWeek) return res.status(400).json({ message: "Neplatný den" });

    const schedules = await Schedule.find({ dayOfWeek })
      .populate("class_id", "name")
      .populate("lessons.subject")
      .populate("lessons.teacher");

    let lessons = [];

    schedules.forEach(s => {
      s.lessons.forEach(l => {
        if (l.teacher._id.toString() === teacherId) {
          lessons.push({
            hour: l.hour,
            class: s.class_id.name,
            subject: l.subject.name,
            room: l.room,
            group_id: l.group_id
          });
        }
      });
    });

    const changes = await ScheduleChanges.find({ date: new Date(date) });

    // (volitelně lze doplnit přepsání změn)

    res.status(200).json(lessons.sort((a, b) => a.hour - b.hour));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassScheduleForDay = async (req, res) => {
  try {
    const { classId, date } = req.query;

    const dayOfWeek = getDayOfWeek(date);
    if (!dayOfWeek) return res.status(400).json({ message: "Neplatný den" });

    const schedule = await Schedule.findOne({ class_id: classId, dayOfWeek })
      .populate("lessons.subject")
      .populate("lessons.teacher");

    if (!schedule) return res.json([]);

    let lessons = schedule.lessons;

    const changes = await ScheduleChanges.findOne({
      class_id: classId,
      date: new Date(date)
    });

    if (changes) {
      lessons = applyScheduleChanges(lessons, changes.changes);
    }

    res.status(200).json(lessons);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { class_id, dayOfWeek, lessons } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { class_id, dayOfWeek },
      {
        class_id,
        dayOfWeek,
        lessons
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(201).json(schedule);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!schedule) {
      return res.status(404).json({ message: "Rozvrh nenalezen" });
    }

    res.status(200).json(schedule);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentLessonDetail = async (req, res) => {
  try {
    const { studentId, date, hour } = req.query;

    const dayOfWeek = getDayOfWeek(date);
    if (!dayOfWeek) {
      return res.status(400).json({ message: "Neplatný den" });
    }

    // 1️⃣ najdeme třídu studenta
    const studentClass = await Class.findOne({ students: studentId });
    if (!studentClass) {
      return res.status(404).json({ message: "Třída nenalezena" });
    }

    // 2️⃣ najdeme skupiny studenta
    const groups = await Group.find({ students: studentId });
    const groupIds = groups.map(g => g._id.toString());

    // 3️⃣ najdeme základní rozvrh
    const schedule = await Schedule.findOne({
      class_id: studentClass._id,
      dayOfWeek
    })
      .populate("lessons.subject")
      .populate("lessons.teacher")
      .populate("class_id", "name");

    if (!schedule) {
      return res.status(404).json({ message: "Rozvrh nenalezen" });
    }

    // 4️⃣ konkrétní hodina
    let lesson = schedule.lessons.find(
      l =>
        l.hour === Number(hour) &&
        (!l.group_id || groupIds.includes(l.group_id.toString()))
    );

    if (!lesson) {
      return res.status(404).json({ message: "Hodina nenalezena" });
    }

    // 5️⃣ změny rozvrhu
    const changes = await ScheduleChanges.findOne({
      class_id: studentClass._id,
      date: new Date(date)
    })
      .populate("changes.teacher")
      .populate("changes.substitute_teacher")
      .populate("changes.grade");

    let lessonDetail = {
      date,
      hour: lesson.hour,
      subject: lesson.subject.name,
      teacher: {
        first_name: lesson.teacher.first_name,
        last_name: lesson.teacher.last_name
      },
      class: studentClass.name,
      group: lesson.group_id || null,
      room: lesson.room,
      type: "normal",
      grade: null,
      note: null
    };

    // 6️⃣ aplikace změny pro danou hodinu
    if (changes) {
      const change = changes.changes.find(c => c.hour === Number(hour));

      if (change) {
        lessonDetail.type = change.type;
        lessonDetail.room = change.room;
        lessonDetail.note = change.note || null;

        if (change.substitute_teacher) {
          lessonDetail.teacher = {
            first_name: change.substitute_teacher.first_name,
            last_name: change.substitute_teacher.last_name
          };
        }

        if (change.grade) {
          lessonDetail.grade = {
            value: change.grade.value,
            weight: change.grade.weight,
            description: change.grade.description
          };
        }
      }
    }

    res.status(200).json(lessonDetail);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

  // Seskupíme změny podle hodiny, protože může být více změn pro jednu hodinu
  const changesByHour = {};
  changes.forEach(change => {
    if (!changesByHour[change.hour]) {
      changesByHour[change.hour] = [];
    }
    changesByHour[change.hour].push(change);
  });

  // Aplikujeme změny pro každou hodinu
  Object.keys(changesByHour).forEach(hourStr => {
    const hour = parseInt(hourStr);
    const hourChanges = changesByHour[hour];
    const index = result.findIndex(l => l.hour === hour);

    if (index === -1) return; // Hodina neexistuje

    const originalLesson = result[index];
    
    // Zjistíme typy změn pro tuto hodinu
    const changeTypes = hourChanges.map(c => c.type);
    const hasCancel = changeTypes.includes("cancel");
    const hasChange = changeTypes.includes("change");
    const hasRoomChange = changeTypes.includes("room_change");
    const hasNote = changeTypes.includes("note");

    // Vytvoříme kopii původní hodiny
    let modifiedLesson = {
      ...originalLesson.toObject ? originalLesson.toObject() : { ...originalLesson }
    };

    // Pokud je hodina zrušená, označíme ji jako zrušenou, ale neodstraníme
    if (hasCancel) {
      modifiedLesson.scheduleChangeType = "cancel";
      modifiedLesson.scheduleChange = hourChanges.length === 1 ? hourChanges[0] : hourChanges;
      if (changeTypes.length > 1) {
        modifiedLesson.scheduleChangeTypes = changeTypes;
      }
      result[index] = modifiedLesson;
      return; // Neaplikujeme další změny, jen označíme jako zrušenou
    }

    // Aplikujeme změny v pořadí: change, room_change, note
    if (hasChange) {
      const changeChange = hourChanges.find(c => c.type === "change");
      if (changeChange) {
        // Pro suplování použijeme substitute_teacher pokud existuje, jinak původního učitele
        if (changeChange.substitute_teacher) {
          modifiedLesson.teacher = changeChange.substitute_teacher;
        }
        // Pokud je v change změněna místnost, použijeme ji
        if (changeChange.room) {
          modifiedLesson.room = changeChange.room;
        }
        // Pokud je v change změněn group_id, použijeme ho
        if (changeChange.group_id !== undefined && changeChange.group_id !== null) {
          modifiedLesson.group_id = changeChange.group_id;
        }
      }
    }

    if (hasRoomChange) {
      const roomChange = hourChanges.find(c => c.type === "room_change");
      if (roomChange && roomChange.room) {
        modifiedLesson.room = roomChange.room;
      }
    }

    if (hasNote) {
      const noteChange = hourChanges.find(c => c.type === "note");
      if (noteChange && noteChange.note) {
        modifiedLesson.note = noteChange.note;
      }
    }

    // Přidáme informace o schedule change pro frontend
    // Priorita: change > room_change > note (cancel už je zpracováno výše)
    if (hasChange) {
      modifiedLesson.scheduleChangeType = "change";
    } else if (hasRoomChange) {
      modifiedLesson.scheduleChangeType = "room_change";
    } else if (hasNote) {
      modifiedLesson.scheduleChangeType = "note";
    }
    
    // Pokud je více typů změn, uložíme všechny
    if (changeTypes.length > 1) {
      modifiedLesson.scheduleChangeTypes = changeTypes;
    }

    // Uložíme celou změnu pro detail
    modifiedLesson.scheduleChange = hourChanges.length === 1 ? hourChanges[0] : hourChanges;

    result[index] = modifiedLesson;
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

    // Načteme schedule changes s populated daty
    const changes = await ScheduleChanges.findOne({
      class_id: studentClass._id,
      date: new Date(date)
    })
      .populate("changes.teacher", "first_name last_name")
      .populate("changes.substitute_teacher", "first_name last_name");

    if (changes && changes.changes && changes.changes.length > 0) {
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
          const lessonObj = l.toObject ? l.toObject() : { ...l };
          lessons.push({
            ...lessonObj,
            class: s.class_id.name,
            class_id: s.class_id._id
          });
        }
      });
    });

    // Aplikujeme schedule changes pro všechny třídy, kde učitel učí
    const classIds = [...new Set(lessons.map(l => l.class_id.toString()))];
    
    for (const classId of classIds) {
      const changes = await ScheduleChanges.findOne({
        class_id: classId,
        date: new Date(date)
      })
        .populate("changes.teacher", "first_name last_name")
        .populate("changes.substitute_teacher", "first_name last_name");

      if (changes && changes.changes && changes.changes.length > 0) {
        // Aplikujeme změny pouze na hodiny tohoto učitele v této třídě
        const classLessons = lessons.filter(l => l.class_id.toString() === classId);
        const updatedLessons = applyScheduleChanges(classLessons, changes.changes);
        
        // Aktualizujeme lessons array
        lessons = lessons.filter(l => l.class_id.toString() !== classId);
        lessons.push(...updatedLessons);
      }
    }

    // Transformujeme na formát pro frontend
    const result = lessons.map(l => ({
      hour: l.hour,
      subject: l.subject,
      teacher: l.teacher,
      room: l.room,
      class: l.class,
      class_id: l.class_id,
      group_id: l.group_id,
      scheduleChangeType: l.scheduleChangeType,
      scheduleChangeTypes: l.scheduleChangeTypes,
      scheduleChange: l.scheduleChange,
      note: l.note
    }));

    res.status(200).json(result.sort((a, b) => a.hour - b.hour));

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

    // Načteme schedule changes s populated daty
    const changes = await ScheduleChanges.findOne({
      class_id: classId,
      date: new Date(date)
    })
      .populate("changes.teacher", "first_name last_name")
      .populate("changes.substitute_teacher", "first_name last_name");

    if (changes && changes.changes && changes.changes.length > 0) {
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

    // 7️⃣ načteme známku z Grade modelu pro danou hodinu (pokud není v schedule change)
    if (!lessonDetail.grade) {
      const gradeDate = new Date(date);
      const startOfDay = new Date(gradeDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(gradeDate);
      endOfDay.setHours(23, 59, 59, 999);

      const grade = await Grade.findOne({
        student_id: studentId,
        subject_id: lesson.subject._id,
        class_id: studentClass._id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
        .populate("subject_id", "name")
        .populate("teacher_id", "first_name last_name")
        .sort({ date: -1 }); // Pokud je více známek, vezmeme nejnovější

      if (grade) {
        lessonDetail.grade = {
          value: grade.value === 0 ? 0 : grade.value,
          weight: grade.weight,
          description: grade.description || ""
        };
      }
    }

    res.status(200).json(lessonDetail);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

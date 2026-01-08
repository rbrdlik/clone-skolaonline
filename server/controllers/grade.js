const Grade = require("../models/grade");
const Subject = require("../models/subject");
const User = require("../models/user");

exports.getStudentGradesSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const grades = await Grade.find({ student_id: studentId })
      .populate("subject_id", "name")
      .sort({ date: 1 });

    const result = {};

    grades.forEach(grade => {
      const subjectId = grade.subject_id._id.toString();
      const subjectName = grade.subject_id.name;

      if (!result[subjectId]) {
        result[subjectId] = {
          subject: subjectName,
          grades: [],
          weightedSum: 0,
          weightSum: 0
        };
      }

      // seznam známek (jen hodnoty)
      if (grade.value !== 0) {
        result[subjectId].grades.push(grade.value);
      } else {
        result[subjectId].grades.push("NH");
      }

      // výpočet průměru (NH se nepočítá)
      if (grade.value !== 0) {
        result[subjectId].weightedSum += grade.value * grade.weight;
        result[subjectId].weightSum += grade.weight;
      }
    });

    const response = Object.values(result).map(item => ({
      subject: item.subject,
      average:
        item.weightSum > 0
          ? Number((item.weightedSum / item.weightSum).toFixed(2))
          : null,
      grades: item.grades
    }));

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentGradesBySubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;

    const grades = await Grade.find({
      student_id: studentId,
      subject_id: subjectId
    })
      .populate("subject_id", "name")
      .populate("teacher_id", "first_name last_name")
      .sort({ date: -1 });

    const response = grades.map(g => ({
      value: g.value === 0 ? "NH" : g.value,
      weight: g.weight,
      description: g.description,
      subject: g.subject_id.name,
      teacher: `${g.teacher_id.first_name} ${g.teacher_id.last_name}`,
      date: g.date
    }));

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGradesBulk = async (req, res) => {
  try {
    const {
      subject_id,
      teacher_id,
      class_id,
      weight,
      description,
      date,
      grades
    } = req.body;

    if (!grades || !grades.length) {
      return res.status(400).json({ message: "Nejsou zadány známky" });
    }

    const gradeDate = date ? new Date(date) : new Date();

    const documents = grades.map(g => ({
      student_id: g.student_id,
      subject_id,
      teacher_id,
      class_id,
      value: g.value, // 0 = NH
      weight,
      description,
      date: gradeDate
    }));

    const result = await Grade.insertMany(documents);

    res.status(201).json({
      message: "Známky vytvořeny",
      count: result.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkGradesForLesson = async (req, res) => {
  try {
    const { classId, subjectId, date } = req.query;

    if (!classId || !subjectId || !date) {
      return res.status(400).json({ message: "Chybí potřebné parametry" });
    }

    const gradeDate = new Date(date);
    const startOfDay = new Date(gradeDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(gradeDate);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Grade.countDocuments({
      class_id: classId,
      subject_id: subjectId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.status(200).json({ hasGrades: count > 0, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;

    const grades = await Grade.find({ student_id: studentId })
      .populate("subject_id", "name short_name")
      .populate("teacher_id", "first_name last_name")
      .populate("class_id", "name")
      .sort({ date: -1 });

    const response = grades.map(g => ({
      _id: g._id,
      value: g.value === 0 ? "NH" : g.value,
      weight: g.weight,
      description: g.description || "",
      subject: g.subject_id.name,
      subjectShort: g.subject_id.short_name,
      teacher: `${g.teacher_id.first_name} ${g.teacher_id.last_name}`,
      class: g.class_id.name,
      date: g.date
    }));

    res.status(200).json(response);

    const grades = await Grade.find({ student_id: studentId })
      .populate("subject_id", "name")
      .sort({ date: 1 });

    const result = {};

    grades.forEach(grade => {
      const subjectId = grade.subject_id._id.toString();
      const subjectName = grade.subject_id.name;

      if (!result[subjectId]) {
        result[subjectId] = {
          subject: subjectName,
          grades: [],
          weightedSum: 0,
          weightSum: 0
        };
      }

      // seznam známek (jen hodnoty)
      if (grade.value !== 0) {
        result[subjectId].grades.push(grade.value);
      } else {
        result[subjectId].grades.push("NH");
      }

      // výpočet průměru (NH se nepočítá)
      if (grade.value !== 0) {
        result[subjectId].weightedSum += grade.value * grade.weight;
        result[subjectId].weightSum += grade.weight;
      }
    });

    const response = Object.values(result).map(item => ({
      subject: item.subject,
      average:
        item.weightSum > 0
          ? Number((item.weightedSum / item.weightSum).toFixed(2))
          : null,
      grades: item.grades
    }));

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, weight, description } = req.body;

    const gradeValue = value === "NH" ? 0 : parseFloat(value);

    const grade = await Grade.findByIdAndUpdate(
      id,
      {
        value: gradeValue,
        weight,
        description: description || ""
      },
      { new: true }
    ).populate("subject_id", "name short_name")
     .populate("teacher_id", "first_name last_name")
     .populate("class_id", "name");

    if (!grade) {
      return res.status(404).json({ message: "Známka nenalezena" });
    }

    res.status(200).json({
      message: "Známka upravena",
      payload: {
        _id: grade._id,
        value: grade.value === 0 ? "NH" : grade.value,
        weight: grade.weight,
        description: grade.description || "",
        subject: grade.subject_id.name,
        subjectShort: grade.subject_id.short_name,
        teacher: `${grade.teacher_id.first_name} ${grade.teacher_id.last_name}`,
        class: grade.class_id.name,
        date: grade.date
      }
    });
exports.getStudentGradesBySubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;

    const grades = await Grade.find({
      student_id: studentId,
      subject_id: subjectId
    })
      .populate("subject_id", "name")
      .populate("teacher_id", "first_name last_name")
      .sort({ date: -1 });

    const response = grades.map(g => ({
      value: g.value === 0 ? "NH" : g.value,
      weight: g.weight,
      description: g.description,
      subject: g.subject_id.name,
      teacher: `${g.teacher_id.first_name} ${g.teacher_id.last_name}`,
      date: g.date
    }));

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByIdAndDelete(id);

    if (!grade) {
      return res.status(404).json({ message: "Známka nenalezena" });
    }

    res.status(200).json({ message: "Známka smazána" });
exports.createGradesBulk = async (req, res) => {
  try {
    const {
      subject_id,
      teacher_id,
      class_id,
      weight,
      description,
      grades
    } = req.body;

    if (!grades || !grades.length) {
      return res.status(400).json({ message: "Nejsou zadány známky" });
    }

    const documents = grades.map(g => ({
      student_id: g.student_id,
      subject_id,
      teacher_id,
      class_id,
      value: g.value, // 0 = NH
      weight,
      description
    }));

    const result = await Grade.insertMany(documents);

    res.status(201).json({
      message: "Známky vytvořeny",
      count: result.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

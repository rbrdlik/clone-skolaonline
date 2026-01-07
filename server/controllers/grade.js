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

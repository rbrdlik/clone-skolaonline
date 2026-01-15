const ScheduleChanges = require("../models/scheduleChanges");

exports.createScheduleChange = async (req, res) => {
  try {
    const {
      class_id,
      date,
      hour,
      type,
      subject,
      teacher,
      room,
      group_id = null,
      grade = null,
      substitute_teacher = null,
      note = null
    } = req.body;

    if (!class_id || !date || hour === undefined || hour === null || !type || !subject || !teacher) {
      return res.status(400).json({ message: "Chybí povinná data" });
    }

    const changeData = {
      hour,
      type,
      subject,
      teacher,
      room: room || "",
      group_id,
      grade,
      substitute_teacher,
      note
    };

    // 1️⃣ existuje změna pro daný den?
    let scheduleChange = await ScheduleChanges.findOne({
      class_id,
      date: new Date(date)
    });

    // 2️⃣ pokud ne, vytvoříme nový dokument
    if (!scheduleChange) {
      scheduleChange = await ScheduleChanges.create({
        class_id,
        date: new Date(date),
        changes: [changeData]
      });

      return res.status(201).json({
        message: "Změna rozvrhu vytvořena",
        payload: scheduleChange
      });
    }

    // 3️⃣ pokud ano → zkontrolujeme, jestli už existuje změna pro tuto hodinu
    const existingIndex = scheduleChange.changes.findIndex(
      c => c.hour === hour && c.type === type
    );

    if (existingIndex !== -1) {
      // Pokud existuje změna stejného typu, přepíšeme ji
      scheduleChange.changes[existingIndex] = changeData;
    } else {
      // Pokud neexistuje změna stejného typu, přidáme novou (umožní kombinace)
      scheduleChange.changes.push(changeData);
    }

    await scheduleChange.save();

    res.status(200).json({
      message: "Změna rozvrhu aktualizována",
      payload: scheduleChange
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteScheduleChangeHour = async (req, res) => {
  try {
    const { class_id, date, hour, type } = req.body;

    const scheduleChange = await ScheduleChanges.findOne({
      class_id,
      date: new Date(date)
    });

    if (!scheduleChange) {
      return res.status(404).json({ message: "Změna nenalezena" });
    }

    // Pokud je specifikován typ, odstraníme pouze změnu tohoto typu
    // Jinak odstraníme všechny změny pro tuto hodinu
    if (type) {
      scheduleChange.changes = scheduleChange.changes.filter(
        c => !(c.hour === Number(hour) && c.type === type)
      );
    } else {
      scheduleChange.changes = scheduleChange.changes.filter(
        c => c.hour !== Number(hour)
      );
    }

    await scheduleChange.save();

    res.status(200).json({
      message: "Změna hodiny odstraněna",
      payload: scheduleChange
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteScheduleChangeDay = async (req, res) => {
  try {
    const { class_id, date } = req.body;

    await ScheduleChanges.findOneAndDelete({
      class_id,
      date: new Date(date)
    });

    res.status(204).send();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getScheduleChangesByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ message: "Chybí classId nebo date" });
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const startOfDay = new Date(dateObj);
    dateObj.setHours(23, 59, 59, 999);
    const endOfDay = new Date(dateObj);

    const scheduleChange = await ScheduleChanges.findOne({
      class_id: classId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate("changes.teacher", "first_name last_name")
      .populate("changes.substitute_teacher", "first_name last_name");

    if (!scheduleChange) {
      return res.status(200).json({ changes: [] });
    }

    res.status(200).json({ changes: scheduleChange.changes });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
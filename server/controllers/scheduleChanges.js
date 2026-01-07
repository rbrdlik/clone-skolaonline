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

    if (!class_id || !date || !hour || !type || !subject || !teacher || !room) {
      return res.status(400).json({ message: "Chybí povinná data" });
    }

    const changeData = {
      hour,
      type,
      subject,
      teacher,
      room,
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

    // 3️⃣ pokud ano → přepíšeme / aktualizujeme hodinu
    const existingIndex = scheduleChange.changes.findIndex(
      c => c.hour === hour
    );

    if (existingIndex !== -1) {
      scheduleChange.changes[existingIndex] = changeData;
    } else {
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
    const { class_id, date, hour } = req.body;

    const scheduleChange = await ScheduleChanges.findOne({
      class_id,
      date: new Date(date)
    });

    if (!scheduleChange) {
      return res.status(404).json({ message: "Změna nenalezena" });
    }

    scheduleChange.changes = scheduleChange.changes.filter(
      c => c.hour !== Number(hour)
    );

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

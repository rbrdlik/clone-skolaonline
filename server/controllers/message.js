const Message = require("../models/message");
const Class = require("../models/class");
const Group = require("../models/group");

/**
 * Pomocná funkce – klíč měsíce (january2026)
 */
const getMonthKey = (date) => {
  const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const year = date.getFullYear();
  return `${month}${year}`;
};

exports.getMessagesForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1️⃣ najdeme třídu studenta
    const studentClass = await Class.findOne({ students: studentId });
    if (!studentClass) {
      return res.status(404).json({ message: "Student nemá přiřazenou třídu" });
    }

    // 2️⃣ najdeme skupiny studenta
    const groups = await Group.find({ students: studentId });
    const groupIds = groups.map(g => g._id);

    // 3️⃣ najdeme všechny zprávy určené studentovi
    const messages = await Message.find({
      $or: [
        { recipient_id: studentId },
        { class_id: studentClass._id },
        { group_id: { $in: groupIds } }
      ]
    })
      .populate("sender_id", "first_name last_name gender")
      .sort({ created_at: -1 });

    // 4️⃣ seskupení podle měsíců
    const grouped = {};

    messages.forEach(msg => {
      const key = getMonthKey(msg.created_at);

      if (!grouped[key]) grouped[key] = [];

      grouped[key].push({
        id: msg._id,
        title: msg.title,
        description:
          msg.content.substring(0, 50) +
          (msg.content.length > 50 ? "..." : ""),
        author: {
          first_name: msg.sender_id.first_name,
          last_name: msg.sender_id.last_name,
          gender: msg.sender_id.gender
        },
        created_at: msg.created_at
      });
    });

    res.status(200).json(grouped);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessageDetail = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("sender_id", "first_name last_name gender");

    if (!message) {
      return res.status(404).json({ message: "Zpráva nenalezena" });
    }

    res.status(200).json({
      id: message._id,
      title: message.title,
      content: message.content,
      author: {
        first_name: message.sender_id.first_name,
        last_name: message.sender_id.last_name,
        gender: message.sender_id.gender
      },
      created_at: message.created_at
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const {
      sender_id,
      title,
      content,
      class_id = null,
      group_id = null,
      recipient_id = null
    } = req.body;

    if (!class_id && !group_id && !recipient_id) {
      return res.status(400).json({
        message: "Zpráva musí mít příjemce (student / třída / skupina)"
      });
    }

    const message = await Message.create({
      sender_id,
      title,
      content,
      class_id,
      group_id,
      recipient_id
    });

    res.status(201).json({
      message: "Zpráva vytvořena",
      payload: message
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


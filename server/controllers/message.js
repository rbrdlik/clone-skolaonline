const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const data = new Message(req.body);
    const result = await data.save();
    if (result)
      return res.status(201).send({ message: "Message sent", payload: result });
    res.status(404).send({ message: "Message not sent" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getInbox = async (req, res) => {
  try {
    const data = await Message.find({
      recipient_id: req.params.userId,
    }).populate("sender_id class_id group_id recipient_id");
    if (data.length)
      return res
        .status(200)
        .send({ message: "Inbox messages found", payload: data });
    res.status(404).send({ message: "Inbox empty" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getSentMessages = async (req, res) => {
  try {
    const data = await Message.find({ sender_id: req.params.userId }).populate(
      "sender_id class_id group_id recipient_id"
    );
    if (data.length)
      return res
        .status(200)
        .send({ message: "Sent messages found", payload: data });
    res.status(404).send({ message: "No sent messages" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const data = await Message.findById(req.params.id).populate(
      "sender_id class_id group_id recipient_id"
    );
    if (data)
      return res.status(200).send({ message: "Message found", payload: data });
    res.status(404).send({ message: "Message not found" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const result = await Message.findByIdAndDelete(req.params.id);
    if (result)
      return res
        .status(200)
        .send({ message: "Message deleted", payload: result });
    res.status(404).send({ message: "Message not deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
};

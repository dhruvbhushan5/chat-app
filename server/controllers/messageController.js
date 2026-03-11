const Message = require("../models/messageModel");
const { Op } = require("sequelize");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: from, receiverId: to },
          { senderId: to, receiverId: from },
        ],
      },
      order: [["updatedAt", "ASC"]],
    });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.senderId.toString() === from.toString(),
        message: msg.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      text: message,
      senderId: from,
      receiverId: to,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

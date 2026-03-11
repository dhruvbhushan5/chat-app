const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    const userData = user.toJSON();
    delete userData.password;
    return res.json({ status: true, user: userData });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ where: { username } });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ where: { email } });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    const userData = user.toJSON();
    delete userData.password;
    return res.json({ status: true, user: userData });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        _id: { [Op.ne]: req.params.id },
      },
      attributes: ["email", "username", "avatarImage", "_id"],
    });
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const user = await User.findByPk(userId);
    if (user) {
      user.isAvatarImageSet = true;
      user.avatarImage = avatarImage;
      await user.save();
      return res.json({
        isSet: user.isAvatarImageSet,
        image: user.avatarImage,
      });
    }
    return res.json({ msg: "User not found" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

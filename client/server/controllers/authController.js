import bcrypt from "bcrypt";
import { User } from "../models/Schema.js";

export const registerUserController = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashPassword, usertype });
    await user.save();

    res.status(201).json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      usertype: user.usertype,
      token:    user._id.toString(),
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid credentials" });

    res.status(200).json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      usertype: user.usertype,
      token:    user._id.toString(),
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
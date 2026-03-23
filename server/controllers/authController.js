import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Schema.js';

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ username, email, password: hashedPassword, usertype });
    await user.save();

    res.status(201).json({ message: '✅ Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Password match karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // JWT token banao
    const token = jwt.sign(
      { id: user._id, username: user.username, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: '✅ Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
};
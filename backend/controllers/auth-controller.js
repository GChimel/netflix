import { User } from '../models/user-model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetcookie } from '../utils/generateToken.js';

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters!' });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists!' });
    }
    if (existingUserByUsername) {
      return res.status(400).json({ success: false, message: 'Username already exists!' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]; // Randomly select a profile picture

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    generateTokenAndSetcookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: {
        ...newUser._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('Error in signup controller: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid credentials!' });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }

    generateTokenAndSetcookie(user._id, res);

    res.status(200).json({
      success: true,
      message: {
        ...user._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('Error in login controller: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('jwt-netflix'); // Clear the JWT cookie
    res.status(200).json({ success: true, message: 'Logout successfully' });
  } catch (error) {
    console.log('Error in logout controller: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

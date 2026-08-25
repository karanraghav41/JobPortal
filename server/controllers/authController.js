const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all details',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";

    if (req.files && req.files.image) {
      try {
        const path = require('path');

        const uploadPath = path.join(
          __dirname,
          '../public/uploads/',
          req.files.image.name
        );

        await req.files.image.mv(uploadPath);

        imageUrl = `http://localhost:${process.env.PORT || 3000}/uploads/${req.files.image.name}`;
      } catch (uploadErr) {
        console.error("Local upload error:", uploadErr);

        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
        });
      }
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });

  } catch (error) {
    console.error('Error in registerUser:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all details',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // FIXED COOKIE SETTINGS
    res.cookie('token', token, {
      httpOnly: true,

      // HTTPS only in production
      secure: process.env.NODE_ENV === 'production',

      // Localhost -> lax
      // Production -> none
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',

      path: '/',

      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user,
      token,
    });

  } catch (error) {
    console.error('Error in loginUser:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Logout User
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',

      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });

  } catch (error) {
    console.error('Error in logout:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
};
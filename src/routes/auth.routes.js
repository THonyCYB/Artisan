const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      const User = require('../models/user.model');

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists'
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        name,
        role
      });

      await user.save();

      // Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const User = require('../models/user.model');

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
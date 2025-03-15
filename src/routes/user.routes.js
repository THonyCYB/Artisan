const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await req.user.populate('profile');
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updates = req.body;
      Object.keys(updates).forEach(key => {
        req.user[key] = updates[key];
      });
      await req.user.save();

      res.status(200).json({
        status: 'success',
        data: { user: req.user }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

router.get('/profile', protect, userController.getProfile);
router.patch('/profile', protect, userController.updateProfile);

module.exports = router;
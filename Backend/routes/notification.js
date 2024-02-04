// routes/notifications.js
import express from 'express';
const router = express.Router();
import Notification from '../Models/Notification';
import protect from '../Middleware/auth';
// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().populate('sender');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new notification
router.post('/',protect, async (req, res) => {
  try {
    const sender = req.user._id;
    if (!sender) throw new Error('Sender not found');

    const notification = new Notification({
      sender: sender,
      message: req.body.message,
    });

    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

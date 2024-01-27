import express from "express";
import protect from "../Middleware/auth";
const notificationRouter=express.Router()

notificationRouter.route('/').get(protect, async (req, res) => {
    try {
      const userId = req.user._id; // Assuming req.user._id is available after authentication
  
      const notifications = await Notification.find({ user: userId }).sort({ timestamp: -1 });
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
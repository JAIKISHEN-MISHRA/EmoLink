// models/Notification.js

import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisteredUser',
    required: true
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

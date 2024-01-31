// routes/friendRequests.js

import express from 'express';
import FriendRequest from '../Models/friendRequest.js';
import Register from '../Models/User.js';
import protect from '../Middleware/auth.js';

const friendRouter = express.Router();

friendRouter.post('/send-request', async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    // Find the _id for the sender
    const senderUser = await Register.findOne({ email: senderEmail });
    if (!senderUser) {
      return res.status(400).json({ message: 'Sender not found.' });
    }

    // Find the _id for the receiver
    const receiverUser = await Register.findOne({ email: receiverEmail });
    if (!receiverUser) {
      return res.status(400).json({ message: 'Receiver not found.' });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderUser._id,
      receiver: receiverUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    const friendRequest = new FriendRequest({
      sender: senderUser._id,
      receiver: receiverUser._id,
      status: 'pending',
    });

    await friendRequest.save();

    res.json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

friendRouter.route('/friend-requests/:userId').get(protect,async (req, res) => {
    try {
      const receiverId = req.params.userId;
      const senderId = req.user._id; // Assuming you have the user ID in the request object
      const friendRequests = await FriendRequest.find({
        receiver: receiverId,
        sender:senderId,
        status: 'pending',
      })
        .populate('sender', 'username') // Populate sender information
        ;
  
      res.json(friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  friendRouter.post('/:id/accept', async (req, res) => {
    try {
      const friendRequestId = req.params.id;
      const friendRequest = await FriendRequest.findById(friendRequestId);
  
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      if (friendRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Friend request has already been handled' });
      }
  
      // Get sender and receiver details
      const senderId = friendRequest.sender;
      const receiverId = friendRequest.receiver;
  
      // Update receiver's followers array with sender's _id
      const receiver = await Register.findByIdAndUpdate(
        receiverId,
        { $push: { followers: senderId } },
        { new: true }
      );
  
      // Update sender's following array with receiver's _id
      const sender = await Register.findByIdAndUpdate(
        senderId,
        { $push: { following: receiverId } },
        { new: true }
      );
  
      // Update friend request status to 'accepted'
      friendRequest.status = 'accepted';
      await friendRequest.save();
  
      res.json({ message: 'Friend request accepted successfully', receiver, sender });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Decline friend request
  friendRouter.post('/:id/decline', async (req, res) => {
    try {
      const friendRequestId = req.params.id;
      const friendRequest = await FriendRequest.findById(friendRequestId);
  
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      if (friendRequest.status !== 'pending') {
        return res.status(400).json({ message: 'Friend request has already been handled' });
      }
  
      // Update friend request status to 'declined'
      friendRequest.status = 'declined';
      await friendRequest.save();
  
      res.json({ message: 'Friend request declined successfully' });
    } catch (error) {
      console.error('Error declining friend request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

export default friendRouter;

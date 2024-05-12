import express from 'express';
import protect from '../Middleware/auth.js';
import Reputation from '../Models/Repuation.js';
import Register from '../Models/User.js';
import Notification from '../Models/Notification.js';
const pointsRouter = express.Router();

pointsRouter.get("/getpoints", protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user points
        const userPoints = await Reputation.findOne({ userId });

        // Fetch follower details
        const followerDetails = await Register.findOne({ userId }).select('followers');

        // Fetch notification details
        const notificationDetail = await Notification.findOne({ receiver: userId }).select('receiver');

        // Handle undefined values
        const followersCount = followerDetails?.followers?.length || 0;
        const notificationsCount = notificationDetail?.receiver?.length || 0;

        if (!userPoints) {
            return res.status(404).send({ message: "Points not available for you yet" ,followersCount,notificationsCount});
        }

        res.status(200).send({ userPoints, followersCount, notificationsCount });
    } catch (error) {
        console.error('Error in getting user points:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default pointsRouter;

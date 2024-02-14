import express from 'express';
import protect from '../Middleware/auth.js';
import Reputation from '../Models/Repuation.js';

const pointsRouter = express.Router();

pointsRouter.get("/getpoints", protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const userPoints = await Reputation.findOne({ userId });

        if (!userPoints) {
            return res.status(404).send({ message: "Soon available for you" });
        }

        res.status(200).send(userPoints);
    } catch (error) {
        console.error('Error in getting user points:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default pointsRouter;

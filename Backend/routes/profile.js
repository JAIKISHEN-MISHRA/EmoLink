// Example backend code using Express.js and Mongoose

import express from 'express';
const profileRouter = express.Router();
import Register from '../Models/User.js';
import Post from '../Models/addPost.js';

// Route to fetch user profile data based on the username
profileRouter.get('/user', async (req, res) => {
    try {
        const { username } = req.query;

        // Fetch user data from RegisteredUser schema
        const user = await Register.findOne({ username })
            .populate('followers', 'username')
            .populate('following', 'username')
            .populate('profilePicture','username')
            .exec();

        // Fetch post count from Post schema based on the author (username)
        const postCount = await Post.countDocuments({ author: username }).exec();

        // Convert followers and following to arrays
        const followersArray = user.followers.map(follower => ({
            id: follower._id,
            username: follower.username
        }));

        const followingArray = user.following.map(followingUser => ({
            id: followingUser._id,
            username: followingUser.username
        }));

        res.json({
            followers: {
                count: followersArray.length,
                users: followersArray
            },
            following: {
                count: followingArray.length,
                users: followingArray
            },
            posts: postCount,
            username: user.username,
            fullName: user.name,
            userImage: user.userImage,
            bio: user.bio,
            id: user._id,
            profile:user.profilePicture
        });
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  


profileRouter.put('/updateBio/:username',  async (req, res) => {
    try {
        const { username } = req.params;
        const { bio } = req.body;

        const user = await Register.findOneAndUpdate(
            { username },
            { $set: { bio } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ bio: user.bio });
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default profileRouter;

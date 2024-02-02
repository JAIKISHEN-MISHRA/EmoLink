import  express  from "express";
import { fetchPost } from "../controllers/getPost.js";
import protect from "../Middleware/auth.js";
import Post from "../Models/addPost.js";

const router=express.Router();
router.get('/getPost',protect,fetchPost);

router.post("/like/:postId", protect, async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post using Array.find()
    const alreadyLikedIndex = post.likes.findIndex((like) => like.user.toString() === userId.toString());

    if (alreadyLikedIndex !== -1) {
      // User has already liked the post, remove the like
      post.likes.splice(alreadyLikedIndex, 1); // Remove the like from the array
    } else {
      // User has not liked the post, add the like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ likes: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/comment/:postId", protect, async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create the comment object
    const comment = {
      user: userId,
      author: req.user.username, // Assuming you have a 'username' field in your user model
      text:content,
      timestamp: new Date(),
    };

    // Add the new comment to the comments array
    post.comments.push(comment);

    await post.save();

    res.status(201).send( post );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;

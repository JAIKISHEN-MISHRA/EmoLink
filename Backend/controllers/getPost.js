import Post from "../Models/addPost.js";
export const fetchPost = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming your authentication middleware adds user information to the request
    // Fetch posts and populate 'likes' field with user details
    const posts = await Post.find().populate('likes.user');

    // Add isLiked property to each post based on whether the user liked it
    const postsWithLikeStatus = posts.map((post) => {
      const alreadyLiked = post.likes.find((like) => like.user._id.toString() === userId.toString());
    
      return {
        ...post.toObject(),
        isLiked: alreadyLiked !== undefined,
      };
    });

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
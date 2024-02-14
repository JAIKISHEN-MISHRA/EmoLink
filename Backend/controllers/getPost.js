import Post from "../Models/addPost.js";
import Register from "../Models/User.js";

export const fetchPost = async (req, res) => {
  try {
    const userId = req.user._id; 
    // Fetch posts and populate 'likes' field with user details
    const posts = await Post.find().populate('likes.user');

    const postsWithProfilePictures = await Promise.all(posts.map(async (post) => {
      const alreadyLiked = post.likes.find((like) => like.user._id.toString() === userId.toString());
      const authorProfile = await Register.findOne({ email: post.author }).select('profilePicture');
    
      return {
        ...post.toObject(),
        isLiked: alreadyLiked !== undefined,
        authorProfilePicture: authorProfile ? authorProfile.profilePicture : null,
      };
    }));

    res.status(200).json(postsWithProfilePictures);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

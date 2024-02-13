import React, { useEffect, useState } from "react";
import Logo from '../../Images/Logo.png';
import axios from "axios";
import "./feeds.css"
import { BsFillXCircleFill } from 'react-icons/bs';

import { fetchPostApi } from "../../../../api";

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [showComment, setShowComment] = useState(null);
  const [myComment, setMyComment] = useState('');

  const token = localStorage.getItem('tokenurl');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchPostApi(config);
        setPosts(response.data);
        console.log(response.data[0])
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeClick = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/getpost/like/${postId}`, {}, config);
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: response.data.likes, isLiked: !post.isLiked } : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const addComment = async (postId) => {
    try {
      // Call your API to add a comment here
      console.log("Adding comment:", myComment);

      // Assuming the API returns the updated comments array
      const updatedComments = await axios.post(`http://localhost:5000/api/getpost/comment/${postId}`, {
        content: myComment
      },config);
      setShowComment(prevShowComment => ({
        ...prevShowComment,
        comments: updatedComments.data.comments
      }));
      console.log(showComment);
      // Clear the comment input
      setMyComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };



  return (
    <>
      <div className="feeds">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="feed" key={post._id}>
              <div className="head">
                <div className="user">
                  <div className="profile-photo">
                    <img src={Logo} alt="Profile" />
                  </div>
                  <div className="info">
                    <h3>{post.author}</h3>
                    <small>{post.timestamp}, {post.timeAgo}</small>
                  </div>
                </div>
                <span className="edit">
                  <i className="uil uil-ellipsis-h"></i>
                </span>
              </div>

              <div className="photo">
                <img src={`data:image/${post.image.contentType};base64,${post.image.data}`} alt="Post" />
              </div>

              <div className="action-buttons">
                <div className="interaction-buttons">
                  <span onClick={() => handleLikeClick(post._id)}>
                    <i className={`uil uil-thumbs-up ${post.isLiked ? 'liked' : ''}`}>
                      {post.likes.length}
                    </i>
                  </span>
                  <span><i className="uil uil-comment" onClick={() => setShowComment(post)}>{post.comments.length}</i></span>
                  <span><i className="uil uil-share">{post.shares}</i></span>
                </div>
                <div className="bookmarks">
                  <span><i className="uil uil-bookmark-full"></i></span>
                </div>
              </div>

              <div className="caption">
                <p>
                  {/* <b>{post.author}</b>  */}
                  {post.caption}</p>
              </div>

              <div className="text-muted" onClick={() => setShowComment(post)}>view all {post.comments.length} comments</div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
     
      
      {showComment && (
  <div className="comment">
    <div className="pop">
      <div className="pop-container">
        <div className="close" onClick={() => setShowComment(null)}>
          <BsFillXCircleFill />
        </div>
        <div className="pop-content">
          <div className="content">
            <img src={`data:image/${showComment.image.contentType};base64,${showComment.image.data}`} alt="Post" />
          </div>
          <div className="comment-bar">
            <div className="user">
              <span className="profile-photo">
                <img src={Logo} alt="Profile" />
              </span>
              <div className="user-name">
                {showComment.author}
              </div>
            </div>
            <hr className="hr" />
            <div className="comments">
              {showComment.comments.map((comment, index) => (
                <div className="comment-x" key={index}>
                  <div className="user">
                    <span className="user-profile-photo">
                      <img src={Logo} alt="Profile" />
                    </span>
                    <div className="user-name">
                      {comment.author}
                    </div>
                  </div>
                  <div className="comment-content">
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="Write-comment">
              <input
                type="text"
                placeholder="Write a comment here .."
                value={myComment}
                className="input"
                onChange={(e) => setMyComment(e.target.value)}
              />
              <button className="btn bt btn-primary" onClick={() => addComment(showComment._id)}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Feeds;

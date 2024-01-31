import React, { useEffect, useState } from "react";
import Logo from '../../Images/Logo.png';
import axios from "axios";

import { fetchPostApi } from "../../../../api";

const Feeds = () => {
  const [posts, setPosts] = useState([]);
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
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeClick = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/getpost/like/${postId}`,{},config);
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: response.data.likes, isLiked: !post.isLiked } : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


  return (
    <>
      <div className="feeds">
        {posts.length > 0 ? (

          posts.map((post) => {
            const base64String = btoa(
              new Uint8Array(post.image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            // const base64String=btoa(
            //   String.fromCharCode(...new Uint8Array((post.image.data.data)))
            // );

            return (
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
                  {/* <img src={`data:image/${post.image.contentType};base64,${base64String}`} alt="Post" /> */}
                  <img src={`data:image/${post.image.contentType};base64,${post.image.data}`} alt="Post" />

                </div>

                <div className="action-buttons">
                  <div className="interaction-buttons">
                    <span onClick={() => handleLikeClick(post._id)}>
                      <i className={`uil uil-thumbs-up ${post.isLiked ? 'liked' : ''}`}>
                        {post.likes.length}
                      </i>
                    </span>
                    <span><i className="uil uil-comment">{post.comments.length}</i></span>
                    <span><i className="uil uil-share">{post.shares}</i></span>
                  </div>
                  <div className="bookmarks">
                    <span><i className="uil uil-bookmark-full"></i></span>
                  </div>
                </div>

                <div className="caption">
                  <p><b>{post.author}</b> {post.caption}</p>
                </div>

                <div className="text-muted">view all {post.comments.length} comments</div>
              </div>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
};

export default Feeds;

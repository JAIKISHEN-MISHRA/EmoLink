import React, { useState } from 'react';
import './Bookmark.css';
import '../Home/Main/Main.js'
import Navbar from "../Home/Navbar/Navbar.js";
import Logo from "../Home/Images/Logo.png"
import Sidebar from '../Home/Main/Sidebar.js';
import Feeds from '../Home/Main/Feeds/feeds.js';

const Bookmark = () => {
    const [posts, setPosts] = useState([
        { id: 1, username: 'User1', content: 'Awesome post!' },
        { id: 2, username: 'User2', content: 'Check out this cool photo!' },
    ]);

    // const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

    // const [showBookmarked, setShowBookmarked] = useState(false);

    // const handleBookmark = (postId) => {
    //     const postToBookmark = posts.find((post) => post.id === postId);
    //     setBookmarkedPosts((prevBookmarkedPosts) => [...prevBookmarkedPosts, postToBookmark]);
    // };

    // const handleToggleView = () => {
    //     setShowBookmarked((prevShowBookmarked) => !prevShowBookmarked);
    // };

    return (
        <>
            <Navbar />
            <div className='bookmark-container'>

                <div className="container  ">

                    <div className="content">
                        <h1>Bookmark</h1>
                        <div className='center'>
                            <div className='feeds'>
                            <div className="feed" >
                                <div className="head">
                                    <div className="user">
                                        <div className="profile-photo">
                                            <img src={Logo} alt="Profile" />
                                        </div>
                                        <div className="info">
                                            <h3>Nikhil</h3>
                                            <small>12-july</small>
                                        </div>
                                    </div>
                                    <span className="edit">
                                        <i className="uil uil-ellipsis-h"></i>
                                    </span>
                                </div>

                                <div className="photo">
                                    <img src={Logo} alt="Post" />
                                </div>

                                <div className="action-buttons">
                                    <div className="interaction-buttons">
                                        <span><i className="uil uil-thumbs-up">105k</i></span>
                                        <span><i className="uil uil-comment">50k</i></span>
                                        <span><i className="uil uil-share">80k</i></span>
                                    </div>
                                    <div className="bookmarks">
                                        <span><i className="uil uil-bookmark-full"></i></span>
                                    </div>
                                </div>

                                <div className="caption">
                                    <p><b>Nikhil</b> COAT</p>
                                </div>

                                <div className="text-muted">view all 12 comments</div>
                            </div>
                            </div>

{/* //// neeche wala backend ke hissab se hai */}
                            
                       
                        {/* <div className="feeds">
                            {posts.length > 0 ?
                                (<>
                                    {posts.map((post) => {
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
                                                <img src={`data:image/${post.image.contentType};base64,${base64String}`} alt="Post" />
                                            </div>

                                            <div className="action-buttons">
                                                <div className="interaction-buttons">
                                                    <span><i className="uil uil-thumbs-up">{post.likes}</i></span>
                                                    <span><i className="uil uil-comment">{post.comments}</i></span>
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

                                    })} 
                                    </>
                                ) 
                                : 
                                (
                                    <p>No posts available.</p>
                                )}
                        </div> */}
                         </div>
                    </div>



                </div>
            </div>
        </>
    );
};


export default Bookmark

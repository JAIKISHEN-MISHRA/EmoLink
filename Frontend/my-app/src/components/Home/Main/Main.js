
import React, { useEffect, useState } from "react";
import './Main.css';
import { addPostApi, acceptFriendRequest, declineFriendRequest } from "../../../api/index.js";
import Logo from "../Images/Logo.png";
import Feeds from "./Feeds/feeds.js";
import Swal from "sweetalert2";
import myFunction from "./Function.js";
import ChatBox from "./Chat/ChatBox.js";
import axios from "axios";
import Story from "./Story/Story.js";
import CreateStory from "./Story/CreateStory.js";
import { BsPlusCircle } from 'react-icons/bs';
import Sidebar from "../Sidebar/Sidebar.js";

const Main = () => {
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [formData, setData] = useState({
        caption: '',
        image: null,
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showStories, setShowStories] = useState(false);
    const [isCreateStory, setCreate] = useState(false);
    const [storiesData, setStoriesData] = useState([])

    useEffect(() => {
        myFunction();
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('tokenurl');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:5000/username', config);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchFriendRequestsData = async () => {
            try {
                const token = localStorage.getItem('tokenurl');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:5000/friendRequests/friend-requests', config);
                setFriendRequests(response.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };
        const fetchStories = async () => {
            try {
                const token = localStorage.getItem('tokenurl');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:5000/addStory', config);
                setStoriesData(response.data.stories); // Update stories state with fetched data
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };

        fetchStories();


        fetchFriendRequestsData();
        fetchUsers();
    }, []);
    const handleInputChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('caption', formData.caption);
            data.append('image', formData.image);

            await addPostApi(data);
            postShowAlertSuccess();
        } catch (error) {
            postShowAlertFail();
            console.error('Error creating post:', error);
        }
    };

    const handleOpenChat = (user) => {
        setSelectedUser(user);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    const toggleStories = (user) => {
        setShowStories(!showStories);
        setSelectedUser(user); // Set the selected user
    };
    

    const toggleCreateStory = () => {
        setCreate(!isCreateStory);
    };

    const postShowAlertSuccess = () => {
        Swal.fire({
            title: 'Post Success',
            text: 'Post Posted',
            icon: 'success',
        });
    };

    const postShowAlertFail = () => {
        Swal.fire({
            title: 'Post Failed',
            text: 'Post not Posted',
            icon: 'error',
        });
    };
    const handleAcceptFriendRequest = async (friendRequestId) => {
        try {
            await acceptFriendRequest(friendRequestId);
            // Update the state or fetch friend requests again to reflect the changes
            // For simplicity, you can reload the friend requests after acceptance
            window.location.reload();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            // Handle the error as needed
        }
    };

    const handleDeclineFriendRequest = async (friendRequestId) => {
        try {
            await declineFriendRequest(friendRequestId);
            // Update the state or fetch friend requests again to reflect the changes
            // For simplicity, you can reload the friend requests after declining
            window.location.reload();
        } catch (error) {
            console.error('Error declining friend request:', error);
            // Handle the error as needed
        }
    };

    return (
        <>
            {showStories ? (
                <Story stories={storiesData} onClose={toggleStories} />
            ) : (
                <>
                    {isCreateStory ? (
                        <CreateStory />
                    ) : (
                        <>
                            <main>
                                <div className="container">
                                    <Sidebar />
                                    <div className="center">
                                        <div className="stories">
                                            {storiesData.map((story) => (
                                                <div key={story._id} className="story" onClick={() => toggleStories(story.userId)}>
                                                    <div className="profile-photo">
                                                        <img src={`data:${story.mimetype};base64,${story.path}`} alt={story.filename} />
                                                    </div>
                                                    <p className="name">{story.userId.username}</p>
                                                </div>
                                            ))}
                                            <div className="story create-face" onClick={toggleCreateStory}>
                                                <BsPlusCircle size={'7vw'} />
                                            </div>
                                        </div>


                                        <form action="" className="create-post" encType="multipart/form-data">
                                            <div className="profile-photo">
                                                <img src={Logo} alt="Post-Pic" />
                                            </div>
                                            <input type="text" placeholder="What's on your mind?" id="create-post" name="caption" value={formData.caption} onChange={handleInputChange} />
                                            <input type="file" className="btn-primary" accept="image/*" name="image" id="create-post-image" onChange={handleImageChange} />
                                            <input type="submit" value="Post" className="btn btn-primary" onClick={handleCreatePost} />
                                        </form>
                                        <Feeds />
                                    </div>
                                    <div className="right">
                                        <div className="messages">
                                            <div className="heading">
                                                <h4>Messages</h4><i className="uil uil-message"></i>
                                            </div>
                                            <div className="search-bar">
                                                <i className="uil uil-search"></i>
                                                <input type="search" placeholder="search messages" id="message-search" />
                                            </div>
                                            <div className="category">
                                                <h6 className="active">Primary</h6>
                                                <h6>General</h6>
                                                <h6 className="message-requests">Requests</h6>
                                            </div>
                                            {selectedUser ? (
                                                <ChatBox user={selectedUser} onClose={handleCloseChat} />
                                            ) : (
                                                users.map(user => (
                                                    <div
                                                        key={user._id}
                                                        className="message"
                                                        onClick={() => handleOpenChat(user)}
                                                    >
                                                        <div className="profile-photo">
                                                            <img src={Logo} alt="Profile" />
                                                        </div>
                                                        <div className="message-body">
                                                            <h5>{user.username}</h5>
                                                        </div>
                                                    </div>
                                                ))
                                            )}

                                        </div>

                                        <div className="friend-requets">
                                            <h4>Requests</h4>
                                            {friendRequests.map(request => (
                                                <div key={request._id} className="request">
                                                    <div className="info">
                                                        <div className="profile-photo">
                                                            <img src={Logo} alt="Profile" />
                                                        </div>
                                                        <div>
                                                            <h5>{request.sender.username}</h5>
                                                            <p className="text-muted">
                                                                {request.sender.username} sent you a friend request
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="action">
                                                        <button className="btn btn-primary" onClick={() => handleAcceptFriendRequest(request._id)}>
                                                            Accept
                                                        </button>
                                                        <button className="btn" onClick={() => handleDeclineFriendRequest(request._id)}>
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </>
                    )}
                </>
            )}
            <div className="customize-theme">
                <div className="card">
                    <h2>Customize your theme</h2>
                    <p>Manage your font size, color, and background</p>

                    <div className="font-size">
                        <h4>Font Size</h4>
                        <div>
                            <h5>Aa</h5>
                            <div className="choose-size">
                                <span className="font-size-1 active"></span>
                                <span className="font-size-2"></span>
                                <span className="font-size-3"></span>
                                <span className="font-size-4"></span>
                                <span className="font-size-5"></span>
                            </div>
                            <h3>Aa</h3>
                        </div>
                    </div>

                    <div className="color">
                        <h4>Color</h4>
                        <div className="choose-color">
                            <span className="color-1 active"></span>
                            <span className="color-2"></span>
                            <span className="color-3"></span>
                            <span className="color-4"></span>
                            <span className="color-5"></span>
                        </div>
                    </div>

                    <div className="background">
                        <h4>Background</h4>
                        <div className="choose-bg">
                            <div className="bg-1 active">
                                <span></span>
                                <h5 htmlFor="bg-1">Light</h5>
                            </div>
                            <div className="bg-2">
                                <span></span>
                                <h5 htmlFor="bg-2">Dim</h5>
                            </div>
                            <div className="bg-3">
                                <span></span>
                                <h5 htmlFor="bg-3">Lights out</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;

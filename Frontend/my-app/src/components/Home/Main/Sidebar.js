import React, { useEffect, useState } from "react";
import './Main.css'
import { addPostApi } from "../../../api/index.js";
import Logo from "../Images/Logo.png"


const Sidebar = () => {
    return (
       
            <div className="left">
                <a href="/profile" className="profile">
                    <div className="profile-photo">
                        <img src={Logo} alt="Profiles" />
                    </div>
                    <div className="handle">
                        <h4>Jaikishen</h4>
                        <p className="text-muted">@jai</p>
                    </div>
                </a>
                <div className="sidebar">
                    <a className="menu-item active">
                        <span><i className="uil uil-home"></i></span><h3>Home</h3>
                    </a>
                    <a className="menu-item">
                        <span><i className="uil uil-compass"></i></span><h3>Explore</h3>
                    </a>
                    <a className="menu-item" id="notifications">
                        <span><i className="uil uil-bell"><small className="notification-count">9+</small></i></span><h3>Notifications</h3>
                        <div className="notifications-popup">
                            <div>
                                <div className="profile-photo">
                                    <img src={Logo} alt="Profile" />
                                </div>
                                <div className="notification-body">
                                    <b>Nikhil Mishra</b> accepted your friend request
                                    <small className="text-muted"> 2 Days Ago</small>
                                </div>
                            </div>
                            <div>
                                <div className="profile-photo">
                                    <img src={Logo} alt="Profile" />
                                </div>
                                <div className="notification-body">
                                    <b>Jammy Khan</b> send you friend request
                                    <small className="text-muted"> 2 Days Ago</small>
                                </div>
                            </div>
                            <div>
                                <div className="profile-photo">
                                    <img src={Logo} alt="Profile" />
                                </div>
                                <div className="notification-body">
                                    <b>Sharjeel Ansari</b> commented on your post
                                    <small className="text-muted"> 4 hours Ago</small>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="menu-item" id="messages-notifications">
                        <span><i className="uil uil-message"><small className="notification-count">6</small></i></span><h3>Messages</h3>
                    </a>
                    <a   className="menu-item">
                        <span><i className="uil uil-bookmark"></i></span><h3>Bookmarks</h3>
                    </a>
                    <a href="/analytics" className="menu-item">
                        <span><i className="uil uil-analytics"></i></span><h3>Analytics</h3>
                    </a>
                    <a className="menu-item" id="theme">
                        <span><i className="uil uil-palette"></i></span><h3>Theme</h3>
                    </a>
                    <a href="/settings" className="menu-item">
                        <span><i className="uil uil-cog"></i></span><h3>Settings</h3>
                    </a>
                </div>
                <label htmlFor="create-post" className="btn btn-primary">Create Post</label>
            </div>
        
    )
}

export default Sidebar

import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Home/Navbar/Navbar.js';
import Logo from '../Home/Images/Logo.png';
import { fetchProfileData, updateBio } from '../../api/index.js';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPencil, BsFillXCircleFill } from 'react-icons/bs';
// import Feeds from '../Home/Main/Feeds/feeds.js';
// import Bookmark from '../Bookmark/Bookmark.js';

const Profile = () => {
  const { username: profileUsername } = useParams();
  const loggedInUsername = localStorage.getItem('token');

  const [userData, setUserData] = useState({
    followers: [],
    following: [],
    posts: 0,
    username: '',
    fullName: '',
    userImage: '',
    bio: '',
    id: '',
  });
  const navigate = useNavigate();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  const [friendRequestSent, setFriendRequestSent] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the profileUsername if available; otherwise, use the logged-in user's username
        const username = profileUsername || loggedInUsername;

        const response = await fetchProfileData(username);
        setUserData(response);

        setEditedBio(response.bio);

        // Check if friend request has been sent
        const friendRequests = await axios.get(`http://localhost:5000/friendRequests/friend-requests/${response.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenurl')}`,
          },
        });

        const sentRequest = friendRequests.data.find(
          (request) => request.receiver._id === response._id && request.status === 'pending'
        );

        setFriendRequestSent(!!sentRequest);
      } catch (error) {
        navigate('/profile');
        Swal.fire({
          title: 'User Not Found',
          text: 'Wrong Email id',
          icon: 'warning',
        });
      }
    };

    fetchData();

  }, [profileUsername, loggedInUsername, navigate]);

  const handleEditBio = () => {
    setIsEditingBio(true);
  };
  const handleSaveBio = async () => {
    try {
      const username = profileUsername || loggedInUsername;
      await updateBio(username, editedBio);

      setUserData((prevData) => ({
        ...prevData,
        bio: editedBio,
      }));

      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };
  const isOwnProfile = profileUsername === loggedInUsername;
  const username = localStorage.getItem('token');

  const handleAddFriend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/friendRequests/send-request', {
        senderEmail: username,
        receiverEmail: profileUsername, // Assuming profileUsername is the user ID
      });

      console.log(response.data.message); // Message from the backend
      setFriendRequestSent(true)
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // ------------------------------------------------------------------
  const [ispop, setpop] = useState(false);
  var [heading, setHeading] = useState(null);
  const [popButtonLabel, setPopButtonLabel] = useState(null);
  const handleFollowerCountClick = () => {
    setHeading("Followers")
    setPopButtonLabel("Remove")
    setpop(true);
  };
  const handleFollowingCountClick = () => {
    setHeading("Following")
    setPopButtonLabel("Unfollow")
    setpop(true);
  };

  const closeModal = () => {
    setpop(false);
    // setPopButtonLabel(null)
  };

  const handleBottomAction = () => {
    if (popButtonLabel === "Remove") {
      setPopButtonLabel("Add")
    }
    if (popButtonLabel === "Add") {
      setPopButtonLabel("Follow")
    }

    if (popButtonLabel === "Unfollow") {
      setPopButtonLabel("Follow")
    }
    if (popButtonLabel === "Follow") {
      setPopButtonLabel("Follow")
    }
  }

  return (
    <div>
      <Navbar />
      <div className=' container profile-container'>
        <div className='profile'>
          <div className='profile-image'>
            <span><img className='user-image' src={Logo} alt='User' /></span>
            <span className='edit-button'>
              <BsPencil className='pencil' /></span>
          </div>

          <div className='profile-info'>
            <div>
              <span className='original-name'>{userData.fullName}</span>
              <h4 className='user-name'>{userData.username}</h4>

            </div>
            <div className='numbers'>
              <a onClick={handleFollowerCountClick} className='num'>
                <div>{userData.followers.count}</div>
                <div>followers</div>
              </a>
              <a onClick={handleFollowingCountClick} className='num'>
                <div>{userData.following.count}</div>
                <div>following</div>
              </a>
              <a className='num'>
                <div>{userData.posts}</div>
                <div>posts</div>
              </a>
              {ispop && (
                <div className="pop">
                  <div className="pop-content">
                    <div className='pop-header'>
                      <h4>Number of {heading}: {heading === "Followers" ? userData.followers.count : userData.following.count}</h4>
                      <span className="close" onClick={closeModal}>
                        <BsFillXCircleFill />
                      </span>
                    </div>
                    <div className='pop-bottom'>
                      {/* Render followers if heading is "Followers" */}
                      {heading === "Followers" && userData.followers.users.map((follower) => {
                        return (
                          <div className='pop-entry' key={follower.id}>
                            <span><img className='user-image' src={Logo} alt='User' /></span>
                            <div className='user-name'>{follower.username}</div>
                            <div>
                              <button className='pop-bottom-button' value={popButtonLabel} onClick={handleBottomAction}>
                                {popButtonLabel}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Render following if heading is "Following" */}
                      {heading === "Following" && userData.following.users.map((following) => {
                        return (
                          <div className='pop-entry' key={following.id}>
                            <span><img className='user-image' src={Logo} alt='User' /></span>
                            <div className='user-name'>{following.username}</div>
                            <div>
                              <button className='pop-bottom-button' value={popButtonLabel} onClick={handleBottomAction}>
                                {popButtonLabel}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            <hr className='hr' />
          </div></div>
        <div className='profile-bottom'>
          <div className='left-about'>
            {isEditingBio ? (
              <>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
                  cols={50}
                />
                <button onClick={handleSaveBio}>Save</button>
              </>
            ) : (
              <>
                <ul>
                  <li className='uil uil-home'>{userData.bio}</li>
                </ul>
                {isOwnProfile && (
                  <button onClick={handleEditBio} className='btn btn-secondary'>
                    Edit Bio
                  </button>
                )}                                </>
            )}
          </div>
          <div className='friend-request'>
            {/* Friend request button and content */}
            {!isOwnProfile && (<button onClick={handleAddFriend}>{friendRequestSent ? 'Request Sent' : 'Add Friend'}</button>)}
          </div>
          <div className='user-posts'>
            <h4>Post</h4>
            <div>
              //post
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Profile;




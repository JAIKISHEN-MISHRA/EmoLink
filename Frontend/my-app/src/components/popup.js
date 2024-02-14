// Popup.js

import React, { useEffect, useState } from 'react';
import './Analytics/Analytics.css'; 
import { fetchUserActivityDuration } from '../api/index.js';
import './Analytics/Analytics.css';
import Swal from 'sweetalert2';


const Popup = () => {
  const [userActivityDuration, setUserActivityDuration] = useState([]);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);

  useEffect(() => {
    console.log("Popupppp")
    const email = localStorage.getItem('token');
    const username = email; // Replace with actual username
    const fetchUserActivityData = async () => {
      try {
        const activityDuration = await fetchUserActivityDuration(username);
        setUserActivityDuration(activityDuration);
      } catch (error) {
        console.error('Error fetching user activity duration:', error);
      }
    };

    fetchUserActivityData();
  }, []);

  useEffect(() => {
    const durations = [7200, 14400, 21600]; // 2 hours, 4 hours, and 6 hours

    const lastActivity = userActivityDuration[userActivityDuration.length - 1];
    if (lastActivity) {
      const lastDurationInSeconds = lastActivity.durationInSeconds;

      for (let i = 0; i < durations.length; i++) {
        const durationInSeconds = durations[i];
        if (lastDurationInSeconds >= durationInSeconds) {
          switch (i) {
            case 0:
              setShowPopup1(true);
              break;
            case 1:
              setShowPopup2(true);
              break;
            case 2:
              setShowPopup3(true);
              break;
            default:
              break;
          }
          // Stop checking further durations once a match is found
          break;
        }
      }
    }
  }, [userActivityDuration]);

  const closeAllPopups = () => {
    setShowPopup1(false);
    setShowPopup2(false);
    setShowPopup3(false);

    // Add logout logic when closing the 5-second popup
    if (showPopup3) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    // Log out logic
    localStorage.removeItem('token');
    localStorage.removeItem('tokenurl');
    window.location.reload();
    Swal.fire({
        title: 'OOPS You Are Exhausted',
        text: 'We value your health.Please do rest',
        icon: 'error',
      });
    console.log('Logout initiated');
  };

  return (
    <div>
      {/* Popup 1 */}
      {showPopup1 && (
        <div className='popup'>
          <div className='popup-inner'>
            <p>You've been active for more than 2 hours!</p>
            <button className='close_icon' onClick={closeAllPopups}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup 2 */}
      {showPopup2 && (
        <div className='popup'>
          <div className='popup-inner'>
            <p>You've been active for more than 4 hours!</p>
            <button className='close_icon' onClick={closeAllPopups}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup 3 */}
      {showPopup3 && (
        <div className='popup'>
          <div className='popup-inner'>
            <p>You've been active for more than 6 hours!</p>
            <button className='close_icon' onClick={closeAllPopups}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;

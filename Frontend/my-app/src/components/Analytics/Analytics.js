import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsPeopleFill, BsFillTrophyFill, BsFillBellFill } from 'react-icons/bs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import Header from '../Home/Navbar/Navbar.js';
import { fetchUserActivityDuration } from '../../api/index.js';
import './Analytics.css';

const formatDuration = (value) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration += `${hours} hours `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes} minutes `;
  }
  formattedDuration += `${seconds} seconds`;

  return formattedDuration.trim();
};

const Analytics = () => {
  const [userActivityDuration, setUserActivityDuration] = useState([]);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);

  useEffect(() => {
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
    // const durations = [3600, 10800, 18000]; // yeh hours ke liye hai (1 hour, 3 hours, 5 hours)
    // const durations = [60, 180, 300]; // yeh minutes ke liye hai (1 minute, 3 minutes, 5 minutes)

    const durations = [1, 3, 5]; // for seconds and testing purposes
  
    const showPopupsSequentially = async () => {
      for (let i = 0; i < durations.length; i++) {
        await new Promise((resolve) => {
          // Show popup after resolving the promise
          setTimeout(() => {
            closeAllPopups();
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
            resolve();
          }, durations[i] * 1000);
        });
      }
    };
  
    showPopupsSequentially();
  
    return () => {
      // Cleanup if needed
    };
  }, []);
  
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
    // You may navigate to the login page or perform any other logout actions here
    console.log('Logout initiated');
  };
  
  return (
    <div>
      <Header className='header' />
      <div className='container'>
        <div className='analytics-grid-container'>
          <main className='analytics-main-container'>
            <div className='main-cards'>
              <div className='card'>
                <div className='card-inner'>
                  <h3>No. of Posts</h3>
                  <BsFillArchiveFill className='card_icon' />
                </div>
                <h1>300</h1>
              </div>
              <div className='card'>
                <div className='card-inner'>
                  <h3>Reward Points</h3>
                  <BsFillTrophyFill className='card_icon' />
                </div>
                <h1>12</h1>
              </div>
              <div className='card'>
                <div className='card-inner'>
                  <h3>No. of Friend Requests</h3>
                  <BsPeopleFill className='card_icon' />
                </div>
                <h1>33</h1>
              </div>
              <div className='card'>
                <div className='card-inner'>
                  <h3>Notifications</h3>
                  <BsFillBellFill className='card_icon' />
                </div>
                <h1>42</h1>
              </div>
            </div>

            <div className='charts'>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={400}
                  height={400}
                  data={userActivityDuration}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="activityTimestamp" />
                  <YAxis dataKey="durationInSeconds" />
                  <Tooltip
                    formatter={(value) => formatDuration(value)}
                  />
                  <Legend />
                  <Bar dataKey="durationInSeconds" fill="rgb(155, 208, 7)" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={userActivityDuration}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="10 10" />
                  <XAxis dataKey="activityTimestamp" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatDuration(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="durationInSeconds"
                    stroke="rgb(155, 208, 7)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </main>
        </div>
      </div>

      {/* Popup 1 */}
      {showPopup1 && (
        <div className='popup'>
          <div className='popup-inner'>
            <p>You've been active for more than 1 hours!</p>
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
            <p>You've been active for more than 3 hours!</p>
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
            <p>You've been active for more than 5 hours!</p>
            <button className='close_icon' onClick={closeAllPopups}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

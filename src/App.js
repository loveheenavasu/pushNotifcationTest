import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import JoinGroup from './components/JoinGroup';
import io from "socket.io-client"

// const socket = io.connect('http://localhost:3001'); // Add this -- our server will run on port 4000, so we connect to it from here
const socket = io.connect('https://pushnotification-wrwj.onrender.com')
  

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [])
  
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<JoinGroup socket={socket}/>} />
        <Route path="/chat/:roomId" element={<ChatPage socket={socket}/>} />
      </Routes>
    </Router>
  );
};

export default App;

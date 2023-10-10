import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import JoinGroup from './components/JoinGroup';

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
        <Route path="/" exact element={<JoinGroup/>} />
        <Route path="/chat/:roomId" element={<ChatPage/>} />
      </Routes>
    </Router>
  );
};

export default App;

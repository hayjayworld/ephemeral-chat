import { useState } from 'react';
import UsernameForm from './components/UsernameForm';
import ChatRoom from './components/ChatRoom';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'chat'
  const [roomData, setRoomData] = useState({ roomId: '', username: '' });

  const handleCreateRoom = async (username) => {
    try {
      const response = await fetch('http://localhost:3001/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      setRoomData({ roomId: data.roomId, username });
      setCurrentView('chat');
    } catch (error) {
      alert('Error creating room: ' + error.message);
    }
  };

  const handleJoinRoom = (username, roomId) => {
    setRoomData({ roomId, username });
    setCurrentView('chat');
  };

  const handleLeaveRoom = () => {
    setCurrentView('home');
    setRoomData({ roomId: '', username: '' });
  };

  return (
    <div className="App">
      {currentView === 'home' ? (
        <UsernameForm 
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
        />
      ) : (
        <ChatRoom 
          roomId={roomData.roomId}
          username={roomData.username}
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
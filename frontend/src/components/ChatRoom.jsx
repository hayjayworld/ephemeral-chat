import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import { useSocket } from '../hooks/useSocket';

const ChatRoom = ({ roomId, username, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const { socket, isConnected } = useSocket('http://localhost:3001');

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit('joinRoom', { roomId: roomId.toUpperCase(), username });

    // Listen for messages
    socket.on('roomHistory', (history) => {
      setMessages(history);
    });

    socket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('userJoined', (systemMessage) => {
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('userLeft', (systemMessage) => {
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('error', (error) => {
      alert(`Error: ${error}`);
      onLeave();
    });

    return () => {
      socket.off('roomHistory');
      socket.off('newMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('error');
    };
  }, [socket, roomId, username, onLeave]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      roomId: roomId.toUpperCase(),
      username,
      message: newMessage.trim()
    };

    socket.emit('chatMessage', messageData);
    setNewMessage('');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Room link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onLeave}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              title="Leave chat"
            >
              ← Leave
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Room: {roomId}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                <span>•</span>
                <span>You: {username}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={copyRoomLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 chat-container">
        <MessageList messages={messages} currentUser={username} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
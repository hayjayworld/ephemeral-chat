import { useState } from 'react';

const UsernameForm = ({ onJoinRoom, onCreateRoom }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    if (!isCreating && !roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    if (isCreating) {
      onCreateRoom(username.trim());
    } else {
      onJoinRoom(username.trim(), roomId.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            EphemeralChat
          </h1>
          <p className="text-gray-600">
            Temporary, private chats that disappear when everyone leaves
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 font-semibold ${
              isCreating 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setIsCreating(true)}
          >
            Create Chat
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold ${
              !isCreating 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setIsCreating(false)}
          >
            Join Chat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Your Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              maxLength={20}
            />
          </div>

          {!isCreating && (
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="Enter room ID"
                maxLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isCreating ? 'Create Chat Room' : 'Join Chat Room'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💬 No registration required</p>
          <p>🔒 Messages disappear when chat ends</p>
          <p>⚡ Real-time communication</p>
        </div>
      </div>
    </div>
  );
};

export default UsernameForm;
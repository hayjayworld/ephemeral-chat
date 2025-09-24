const Message = ({ message, currentUser }) => {
  const isSystemMessage = message.type === 'system';
  const isOwnMessage = message.username === currentUser && !isSystemMessage;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="message-system px-4 py-2 rounded-full text-sm">
          <span className="font-medium">{message.username}</span> {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwnMessage ? 'message-self rounded-br-none' : 'message-other rounded-bl-none'
      }`}>
        {!isOwnMessage && (
          <div className="font-semibold text-sm mb-1 text-gray-700">
            {message.username}
          </div>
        )}
        <div className="text-sm">{message.message}</div>
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} text-right`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
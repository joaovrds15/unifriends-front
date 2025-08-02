import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getMessages } from '../services/userService';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const { connection_id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    socketRef.current = new WebSocket("http://44.204.5.25:8090/api/chat");
    
    // Connection opened
    socketRef.current.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    // Listen for messages
    socketRef.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setChatMessages(prevMessages => [...prevMessages, receivedMessage]);
    };
    
    // Connection closed
    socketRef.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await getMessages(connection_id)
        const data = response.data.data

        setChatMessages(data.messages);
        setOtherUser(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setIsLoading(false);
      }
    };

    if (connection_id && user?.id) {
      fetchChatData();
    }
  }, [connection_id, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleBack = () => {
    navigate('/messages');
  };

const handleSendMessage = (e) => {
  e.preventDefault();
  
  if (!message.trim()) return;
  
  // Create message object with the required structure
  const newMessage = {
    connection_id: parseInt(connection_id),
    content: message,
    sender_id: user?.id,
    receiver_id: otherUser?.user_id
  };

  if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    socketRef.current.send(JSON.stringify(newMessage));
    const tempMessage = {
      id: Date.now(), // Temporary ID until server responds
      sender_id: user?.id,
      receiver_id: otherUser?.id,
      content: message,
      timestamp: new Date().toISOString(),
      sender_name: user?.name
    };
    
    setChatMessages([...chatMessages, tempMessage]);
    setMessage('');
  } else {
    console.error('WebSocket not connected');
  }
};

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="border-4 border-blue-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin mb-2"></div>
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={handleBack} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{otherUser?.name}</h1>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Date separator */}
        <div className="text-center my-4">
          <span className="text-sm text-gray-500">October 22, 2023</span>
        </div>

        {/* Chat messages */}
        {chatMessages.map((msg) => {
          const isCurrentUser = msg.sender_id === user?.id;
          
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                
                {/* Message bubble with avatar */}
                <div className="flex items-end">
                  {!isCurrentUser && <div className="w-2"></div>}
                  
                  <div className={`rounded-2xl px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                  
                  <div className="w-8 h-8 ml-2 flex-shrink-0">
                    {/* Avatar would be displayed here */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Start a message"
          className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
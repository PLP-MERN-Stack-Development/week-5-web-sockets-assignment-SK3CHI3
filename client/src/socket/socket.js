// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';



// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['polling', 'websocket'], // Try polling first, then upgrade
  upgrade: true,
  rememberUpgrade: true,
  timeout: 20000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [deliveredMessages, setDeliveredMessages] = useState(new Set());

  // Connect to socket server
  const connect = (username) => {
    // Always try to connect first
    if (!socket.connected) {
      socket.connect();
    }

    // Handle user join after connection
    if (username && !hasJoined) {
      const joinUser = () => {
        socket.emit('user_join', username);
        setHasJoined(true);
      };

      if (socket.connected) {
        joinUser();
      } else {
        // Wait for connection before emitting user_join
        socket.once('connect', () => {
          joinUser();
        });
      }
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
    setHasJoined(false);
  };

  // Send a message
  const sendMessage = (message) => {
    socket.emit('send_message', { message });
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Set typing status
  const setTyping = (isTyping) => {
    if (socket.connected && hasJoined) {
      socket.emit('typing', isTyping);
    }
  };

  // Join a room
  const joinRoom = (roomId) => {
    socket.emit('join_room', roomId);
  };

  // Add reaction to message
  const addReaction = (messageId, emoji) => {
    socket.emit('add_reaction', { messageId, emoji });
  };

  // Upload file
  const uploadFile = (fileName, fileData, fileType) => {
    socket.emit('upload_file', { fileName, fileData, fileType });
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setHasJoined(false); // Reset join status on disconnect
    };

    const onConnectError = (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Handle user join confirmation
    const onUserJoinedConfirmed = () => {
      setHasJoined(true);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Simple typing event handler
    const onUserTyping = ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter(user => user !== username);
        }
      });
    };

    // New event handlers for additional features
    const onRoomsList = (roomsList) => {
      setRooms(roomsList);
    };

    const onRoomMessages = (roomMessages) => {
      setMessages(roomMessages);
    };

    const onRoomChanged = ({ roomId }) => {
      setCurrentRoom(roomId);
    };

    const onMessageDelivered = ({ messageId }) => {
      setDeliveredMessages(prev => new Set([...prev, messageId]));
    };

    const onMessageReactionUpdated = ({ messageId, reactions }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_joined_confirmed', onUserJoinedConfirmed);
    socket.on('user_left', onUserLeft);
    socket.on('user_typing', onUserTyping);
    socket.on('rooms_list', onRoomsList);
    socket.on('room_messages', onRoomMessages);
    socket.on('room_changed', onRoomChanged);
    socket.on('message_delivered', onMessageDelivered);
    socket.on('message_reaction_updated', onMessageReactionUpdated);



    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_joined_confirmed', onUserJoinedConfirmed);
      socket.off('user_left', onUserLeft);
      socket.off('user_typing', onUserTyping);
      socket.off('rooms_list', onRoomsList);
      socket.off('room_messages', onRoomMessages);
      socket.off('room_changed', onRoomChanged);
      socket.off('message_delivered', onMessageDelivered);
      socket.off('message_reaction_updated', onMessageReactionUpdated);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    rooms,
    currentRoom,
    deliveredMessages,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    addReaction,
    uploadFile,
  };
};

export default socket; 
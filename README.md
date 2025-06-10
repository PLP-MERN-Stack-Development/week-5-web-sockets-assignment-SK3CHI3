# 🔄 Real-Time Chat Application - Week 5 Socket.io Assignment

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19747878&assignment_repo_type=AssignmentRepo)

A fully functional real-time chat application built with **Socket.io**, **Node.js/Express**, and **React**. This project demonstrates bidirectional communication, advanced chat features, and modern web development practices.

## 🚀 Features Implemented

### ✅ **Core Chat Functionality**
- **User Authentication** - Simple username-based authentication with persistent login
- **Global Chat Room** - Real-time messaging for all connected users
- **Message Display** - Messages with sender names, timestamps, and professional styling
- **Typing Indicators** - Live typing indicators with chat bubble design
- **Online/Offline Status** - Real-time user presence tracking

### ✅ **Advanced Chat Features**
- **Private Messaging** - Direct messages between users with secure delivery
- **Multiple Chat Rooms** - Switch between different themed rooms (General, Random, Tech Talk)
- **File & Image Sharing** - Upload and share files with image preview support
- **Message Reactions** - React to messages with emojis (👍, ❤️, 😂, 😮, 😢, 😡)
- **Message Search** - Search through chat history by content or sender
- **Message Delivery Status** - Acknowledgment system for sent messages

### ✅ **Real-Time Notifications**
- **Toast Notifications** - In-app notifications for new messages and events
- **Browser Notifications** - Native browser notifications when tab is inactive
- **Sound Alerts** - Audio notifications for new messages
- **User Join/Leave Alerts** - Notifications when users enter or exit chat
- **Unread Message Counter** - Visual indicator of unread messages in title bar

### ✅ **Performance & UX Optimization**
- **Reconnection Logic** - Automatic reconnection with retry mechanism
- **Socket.io Optimization** - Proper room management and event handling
- **Mobile Responsive Design** - Fully responsive UI for all device sizes
- **Professional UI/UX** - Clean, modern interface with smooth animations
- **Error Handling** - Comprehensive error handling and loading states

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- Socket.io for real-time communication
- CORS for cross-origin requests
- Dotenv for environment configuration

**Frontend:**
- React 18 with Hooks
- Socket.io Client
- Lucide React for icons
- React Hot Toast for notifications
- Date-fns for time formatting
- Vite for development and building

## 📂 Project Structure

```
├── server/
│   ├── server.js          # Main server file with Socket.io setup
│   ├── package.json       # Server dependencies
│   └── node_modules/      # Server dependencies
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UsersList.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── RoomSelector.jsx
│   │   │   ├── MessageReactions.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── MessageSearch.jsx
│   │   ├── hooks/
│   │   │   └── useNotifications.js
│   │   ├── socket/
│   │   │   └── socket.js   # Socket.io client setup
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json       # Client dependencies
│   └── vite.config.js     # Vite configuration
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd week-5-web-sockets-assignment-SK3CHI3
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server** (in the `server` directory)
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3001`

2. **Start the client** (in the `client` directory)
   ```bash
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎮 How to Use

### Basic Chat
1. Enter a username to join the chat
2. Start typing to see typing indicators
3. Send messages to the public chat room
4. See real-time updates from other users

### Advanced Features
- **Switch Rooms**: Click on room names in the sidebar to switch between chat rooms
- **Private Messages**: Click on a user's name to start a private conversation
- **File Sharing**: Click the paperclip icon to upload files or images
- **Message Reactions**: Click the smile icon on any message to add emoji reactions
- **Search Messages**: Use the search bar to find specific messages or senders
- **Notifications**: Enable browser notifications for alerts when the tab is inactive

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

### Client Configuration
Update `client/src/socket/socket.js` if needed:
```javascript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
```

## 📱 Mobile Support

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🎯 Assignment Requirements Met

✅ **Task 1: Project Setup** - Complete
✅ **Task 2: Core Chat Functionality** - Complete
✅ **Task 3: Advanced Chat Features** - 6/6 features implemented
✅ **Task 4: Real-Time Notifications** - Complete
✅ **Task 5: Performance and UX Optimization** - Complete

**Overall Completion: 100%** 🎉

## 🚀 Key Highlights

- **Professional UI/UX** with modern design principles
- **Real-time communication** with Socket.io rooms and namespaces
- **Advanced features** including file sharing, reactions, and search
- **Mobile-first responsive design** for all devices
- **Comprehensive error handling** and loading states
- **Performance optimized** with proper state management
- **Accessibility features** with proper ARIA labels and keyboard navigation

## 👨‍💻 Developer

**SK3CHI3** - Full-stack implementation with focus on user experience and modern web development practices.

---

*This project demonstrates advanced real-time web application development using modern JavaScript frameworks and Socket.io for bidirectional communication.*

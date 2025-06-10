import { useState, useEffect } from 'react'
import { LogOut, Users, MessageCircle, Hash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useSocket } from '../socket/socket'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import UsersList from './UsersList'
import RoomSelector from './RoomSelector'
import MessageSearch from './MessageSearch'
import { useNotifications } from '../hooks/useNotifications'

const ChatRoom = ({ username, isConnected, onLogout }) => {
  const {
    messages,
    users,
    typingUsers,
    rooms,
    currentRoom,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    addReaction,
    uploadFile,
    lastMessage
  } = useSocket()

  const [selectedUser, setSelectedUser] = useState(null)
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Initialize notifications
  const notifications = useNotifications()

  // Handle new messages for notifications
  useEffect(() => {
    if (lastMessage && lastMessage.sender !== username) {
      // Show toast notification for new messages
      if (lastMessage.isPrivate) {
        toast(`💬 Private message from ${lastMessage.sender}`, {
          icon: '🔒',
          duration: 4000,
        })
      } else if (!lastMessage.system) {
        toast(`💬 ${lastMessage.sender}: ${lastMessage.message.substring(0, 50)}${lastMessage.message.length > 50 ? '...' : ''}`, {
          duration: 3000,
        })
      }
    }
  }, [lastMessage, username])

  // Handle connection status changes
  useEffect(() => {
    // Only show notifications after initial load
    const timer = setTimeout(() => {
      if (isConnected) {
        toast.success('Connected to chat server')
      } else {
        toast.error('Disconnected from chat server')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isConnected])

  const handleSendMessage = (message) => {
    if (isPrivateMode && selectedUser) {
      sendPrivateMessage(selectedUser.id, message)
      toast.success(`Private message sent to ${selectedUser.username}`)
    } else {
      sendMessage(message)
    }
    // Reset unread count when user sends a message
    setUnreadCount(0)
  }

  const handleRoomSelect = (roomId) => {
    joinRoom(roomId)
    setIsPrivateMode(false)
    setSelectedUser(null)
    setSearchResults(null)
    setUnreadCount(0)
    toast.success(`Switched to ${rooms.find(r => r.id === roomId)?.name || roomId}`)
  }

  const handleFileUpload = (fileName, fileData, fileType) => {
    uploadFile(fileName, fileData, fileType)
    toast.success(`File "${fileName}" uploaded successfully`)
  }

  const handleSearchResults = (results) => {
    setSearchResults(results.length > 0 ? results : null)
  }

  const handleUserSelect = (user) => {
    if (user.username === username) {
      toast.error("You can't send a message to yourself!")
      return
    }

    setSelectedUser(user)
    setIsPrivateMode(true)
    setSearchResults(null) // Clear search when switching to private mode
    toast.success(`Now chatting privately with ${user.username}`)
  }

  const handleBackToPublic = () => {
    setSelectedUser(null)
    setIsPrivateMode(false)
    setSearchResults(null)
    toast.success('Back to public chat')
  }

  // Track unread messages
  useEffect(() => {
    if (lastMessage && lastMessage.sender !== username && !document.hasFocus()) {
      setUnreadCount(prev => prev + 1)
    }
  }, [lastMessage, username])

  // Update document title with unread count
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Socket Chat`
    } else {
      document.title = 'Socket Chat'
    }
  }, [unreadCount])

  // Clear unread count when window gains focus
  useEffect(() => {
    const handleFocus = () => setUnreadCount(0)
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to leave the chat?')) {
      onLogout()
      toast.success('You have left the chat')
    }
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>
            <MessageCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Socket Chat
          </h3>
          <div className="user-info">
            Logged in as <strong>{username}</strong>
          </div>
        </div>
        
        <RoomSelector
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomSelect={handleRoomSelect}
        />

        <UsersList
          users={users}
          currentUsername={username}
          onUserSelect={handleUserSelect}
          selectedUser={selectedUser}
        />
        
        <div style={{ padding: '20px', borderTop: '1px solid #e9ecef' }}>
          <button 
            onClick={handleLogout}
            className="btn btn-danger w-full"
          >
            <LogOut size={16} />
            Leave Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div>
            <h2>
              {isPrivateMode ? (
                <>
                  🔒 Private chat with {selectedUser?.username}
                  <button 
                    onClick={handleBackToPublic}
                    style={{ 
                      marginLeft: '15px', 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '5px 10px', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Back to Public
                  </button>
                </>
              ) : (
                <>
                  <Hash size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  {rooms.find(r => r.id === currentRoom)?.name || 'Chat Room'}
                </>
              )}
            </h2>
          </div>

          <div className="connection-status">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {!isPrivateMode && (
          <MessageSearch
            messages={messages}
            onSearchResults={handleSearchResults}
            currentUsername={username}
          />
        )}

        {/* Messages */}
        <MessageList
          messages={messages}
          currentUsername={username}
          isPrivateMode={isPrivateMode}
          selectedUser={selectedUser}
          typingUsers={typingUsers}
          onAddReaction={addReaction}
          searchResults={searchResults}
        />

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={setTyping}
          onFileUpload={handleFileUpload}
          disabled={!isConnected}
          placeholder={
            isPrivateMode
              ? `Send a private message to ${selectedUser?.username}...`
              : "Type your message..."
          }
        />
      </div>
    </div>
  )
}

export default ChatRoom

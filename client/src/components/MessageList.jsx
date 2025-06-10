import { useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Lock, Download, FileText, Image } from 'lucide-react'
import TypingIndicator from './TypingIndicator'
import MessageReactions from './MessageReactions'

const MessageList = ({ messages, currentUsername, isPrivateMode, selectedUser, typingUsers = [], onAddReaction, searchResults = null }) => {
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive or typing users change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUsers])

  // Use search results if available, otherwise filter messages based on mode
  const filteredMessages = searchResults !== null
    ? searchResults
    : isPrivateMode && selectedUser
      ? messages.filter(msg =>
          msg.isPrivate && (
            (msg.sender === currentUsername && msg.to === selectedUser.username) ||
            (msg.sender === selectedUser.username && msg.to === currentUsername) ||
            (msg.sender === selectedUser.username) ||
            (msg.to === selectedUser.username)
          )
        )
      : messages.filter(msg => !msg.isPrivate)

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return 'just now'
    }
  }

  const handleFileDownload = (fileName, fileData) => {
    const link = document.createElement('a')
    link.href = fileData
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderFileMessage = (message) => {
    const isImage = message.fileType?.startsWith('image/')

    return (
      <div className="file-message">
        {isImage ? (
          <div className="image-preview">
            <img
              src={message.fileData}
              alt={message.fileName}
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
            />
          </div>
        ) : (
          <div className="file-info">
            <FileText size={20} />
            <span className="file-name">{message.fileName}</span>
          </div>
        )}
        <button
          className="download-button"
          onClick={() => handleFileDownload(message.fileName, message.fileData)}
          title="Download file"
        >
          <Download size={16} />
        </button>
      </div>
    )
  }

  const getMessageClass = (message) => {
    if (message.system) return 'message system'
    return message.sender === currentUsername ? 'message own' : 'message'
  }

  const getBubbleClass = (message) => {
    if (message.system) return 'message-bubble system'
    return message.sender === currentUsername ? 'message-bubble own' : 'message-bubble other'
  }

  const getInfoClass = (message) => {
    if (message.system) return 'message-info system'
    return message.sender === currentUsername ? 'message-info own' : 'message-info'
  }

  const getUserInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  if (filteredMessages.length === 0) {
    return (
      <div className="messages-container">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          {isPrivateMode ? (
            <>
              <Lock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3>Private Chat</h3>
              <p>Start a private conversation with {selectedUser?.username}</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                Messages here are only visible to you and {selectedUser?.username}
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h3>Welcome to the Chat Room!</h3>
              <p>No messages yet. Be the first to say hello!</p>
            </>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    )
  }

  // Filter typing users (exclude current user and handle private mode)
  const filteredTypingUsers = typingUsers.filter(user => {
    if (user === currentUsername) return false

    // In private mode, only show typing if it's the selected user
    if (isPrivateMode && selectedUser) {
      return user === selectedUser.username
    }

    // In public mode, show all typing users
    return !isPrivateMode
  })

  return (
    <div className="messages-container">
      {filteredMessages.map((message) => (
        <div key={message.id} className={getMessageClass(message)}>
          {!message.system && (
            <div className={getInfoClass(message)}>
              <span style={{ fontWeight: '500' }}>
                {message.sender}
                {message.isPrivate && <Lock size={12} style={{ marginLeft: '4px', display: 'inline' }} />}
              </span>
              <span style={{ marginLeft: '8px' }}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          <div className={getBubbleClass(message)}>
            {!message.system && message.sender !== currentUsername && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <div className="user-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                  {getUserInitials(message.sender)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '2px' }}>
                    {message.sender}
                  </div>
                  <div>{message.isFile ? renderFileMessage(message) : message.message}</div>

                  {/* Message reactions */}
                  {onAddReaction && (
                    <MessageReactions
                      message={message}
                      currentUsername={currentUsername}
                      onAddReaction={onAddReaction}
                    />
                  )}
                </div>
              </div>
            )}

            {(message.system || message.sender === currentUsername) && (
              <div>
                {message.isFile ? renderFileMessage(message) : message.message}

                {/* Message reactions for own messages */}
                {onAddReaction && !message.system && (
                  <MessageReactions
                    message={message}
                    currentUsername={currentUsername}
                    onAddReaction={onAddReaction}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Typing Indicators as Message Bubbles */}
      {filteredTypingUsers.map((user) => (
        <div key={`typing-${user}`} className="message">
          <div className="message-bubble other">
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <div className="user-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                {getUserInitials(user)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '2px' }}>
                  {user}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 0'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'typingPulse 1.4s infinite ease-in-out',
                    animationDelay: '0s'
                  }}></span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'typingPulse 1.4s infinite ease-in-out',
                    animationDelay: '0.2s'
                  }}></span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: 'typingPulse 1.4s infinite ease-in-out',
                    animationDelay: '0.4s'
                  }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList

import React from 'react'

const TypingIndicator = ({ typingUsers, currentUsername }) => {
  // Filter out current user
  const otherUsers = typingUsers.filter(user => user !== currentUsername)

  // Don't show anything if no one else is typing
  if (otherUsers.length === 0) {
    return null
  }

  // Format the typing text
  const getTypingText = () => {
    if (otherUsers.length === 1) {
      return `${otherUsers[0]} is typing...`
    } else if (otherUsers.length === 2) {
      return `${otherUsers[0]} and ${otherUsers[1]} are typing...`
    } else {
      return `${otherUsers.slice(0, -1).join(', ')}, and ${otherUsers[otherUsers.length - 1]} are typing...`
    }
  }

  const containerStyle = {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    animation: 'slideUp 0.3s ease-out'
  }

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: otherUsers.length > 1
      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '2px',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const bubbleStyle = {
    background: '#f1f3f4',
    borderRadius: '18px',
    padding: '12px 16px',
    maxWidth: '200px',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    animation: 'bubbleIn 0.2s ease-out'
  }

  const dotsContainerStyle = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20px'
  }

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#9ca3af',
    animation: 'typingPulse 1.4s infinite ease-in-out'
  }

  const usernameStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '4px',
    paddingLeft: '4px',
    fontWeight: '500'
  }

  return (
    <>
      <style>{`
        @keyframes typingPulse {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .typing-bubble-container {
            padding: 12px 16px;
          }
          .typing-avatar {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
          .typing-bubble {
            padding: 10px 14px;
            border-radius: 16px;
          }
          .typing-username {
            font-size: 0.7rem;
          }
        }
      `}</style>
      <div style={containerStyle} className="typing-bubble-container">
        <div style={avatarStyle} className="typing-avatar">
          {otherUsers.length > 1
            ? `${otherUsers.length}`
            : otherUsers[0]?.charAt(0).toUpperCase() || '?'
          }
        </div>
        <div>
          <div style={usernameStyle} className="typing-username">
            {getTypingText()}
          </div>
          <div style={bubbleStyle} className="typing-bubble">
            <div style={dotsContainerStyle}>
              <span style={{...dotStyle, animationDelay: '0s'}}></span>
              <span style={{...dotStyle, animationDelay: '0.2s'}}></span>
              <span style={{...dotStyle, animationDelay: '0.4s'}}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TypingIndicator

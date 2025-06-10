import { Users, MessageSquare } from 'lucide-react'

const UsersList = ({ users, currentUsername, onUserSelect, selectedUser }) => {
  const getUserInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  const getRandomColor = (username) => {
    // Generate a consistent color based on username
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
      '#ff9a9e', '#fecfef', '#ffeaa7', '#fab1a0'
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }

  const onlineUsers = users.filter(user => user.username !== currentUsername)
  const totalUsers = users.length

  return (
    <div className="users-section">
      <h4>
        <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
        Online Users ({totalUsers})
      </h4>
      
      {/* Current User */}
      <div className="user-item" style={{ background: '#e3f2fd', marginBottom: '15px' }}>
        <div 
          className="user-avatar" 
          style={{ background: getRandomColor(currentUsername) }}
        >
          {getUserInitials(currentUsername)}
        </div>
        <div>
          <div className="user-name">{currentUsername} (You)</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Online</div>
        </div>
      </div>

      {/* Other Users */}
      {onlineUsers.length > 0 ? (
        <ul className="users-list">
          {onlineUsers.map((user) => (
            <li key={user.id}>
              <div 
                className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => onUserSelect(user)}
                title={`Click to send private message to ${user.username}`}
                style={{
                  background: selectedUser?.id === user.id ? '#e8f4fd' : 'transparent',
                  border: selectedUser?.id === user.id ? '2px solid #667eea' : '2px solid transparent'
                }}
              >
                <div 
                  className="user-avatar"
                  style={{ background: getRandomColor(user.username) }}
                >
                  {getUserInitials(user.username)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="user-name">{user.username}</div>
                  <div style={{ fontSize: '0.8rem', color: '#28a745' }}>Online</div>
                </div>
                <MessageSquare 
                  size={16} 
                  style={{ 
                    color: '#667eea', 
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease'
                  }} 
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: '#6c757d', 
          padding: '20px',
          fontStyle: 'italic'
        }}>
          <Users size={32} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p>No other users online</p>
          <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
            Share the chat link to invite friends!
          </p>
        </div>
      )}

      {onlineUsers.length > 0 && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#6c757d'
        }}>
          💡 <strong>Tip:</strong> Click on any user to start a private conversation
        </div>
      )}
    </div>
  )
}

export default UsersList

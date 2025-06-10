import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      return
    }

    setIsLoading(true)
    
    // Simulate a brief loading state
    setTimeout(() => {
      onLogin(username.trim())
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="card login-container">
      <div className="flex items-center justify-center mb-3">
        <MessageCircle size={48} color="#667eea" />
      </div>
      
      <h1>Welcome to Chat</h1>
      <p>Enter your username to join the conversation</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          maxLength={20}
          disabled={isLoading}
          autoFocus
        />
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!username.trim() || isLoading}
        >
          {isLoading ? 'Joining...' : 'Join Chat'}
        </button>
      </form>
      
      <div className="mt-3" style={{ fontSize: '0.9rem', color: '#666' }}>
        <p>💡 Tips:</p>
        <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px' }}>
          <li>Click on users to send private messages</li>
          <li>Your messages appear on the right</li>
          <li>Others' messages appear on the left</li>
        </ul>
      </div>
    </div>
  )
}

export default LoginForm

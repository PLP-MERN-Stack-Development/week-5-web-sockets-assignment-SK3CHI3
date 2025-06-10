import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import LoginForm from './components/LoginForm'
import ChatRoom from './components/ChatRoom'
import { useSocket } from './socket/socket'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { isConnected, connect, disconnect } = useSocket()

  // Check for saved username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername')
    if (savedUsername && !isLoggedIn) {
      setUsername(savedUsername)
      setIsLoggedIn(true)
      connect(savedUsername)
    }
  }, [connect, isLoggedIn])

  const handleLogin = (newUsername) => {
    setUsername(newUsername)
    setIsLoggedIn(true)
    localStorage.setItem('chatUsername', newUsername)
    connect(newUsername)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('chatUsername')
    disconnect()
  }

  return (
    <div className="app">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ChatRoom 
          username={username}
          isConnected={isConnected}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App

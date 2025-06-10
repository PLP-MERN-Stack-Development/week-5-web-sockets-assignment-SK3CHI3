import { useEffect, useState } from 'react'

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result)
      })
    }
  }, [permission])

  // Create notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return
    
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('Could not play notification sound:', error)
    }
  }

  const showNotification = (title, options = {}) => {
    // Play sound
    playNotificationSound()

    // Show browser notification if permission granted
    if (permission === 'granted' && document.hidden) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'chat-message',
        renotify: true,
        ...options
      })

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Focus window when notification is clicked
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return notification
    }
  }

  const showMessageNotification = (sender, message, isPrivate = false) => {
    const title = isPrivate 
      ? `🔒 Private message from ${sender}`
      : `💬 New message from ${sender}`
    
    const body = message.length > 100 
      ? message.substring(0, 100) + '...'
      : message

    return showNotification(title, {
      body,
      icon: '/favicon.ico'
    })
  }

  const showUserJoinedNotification = (username) => {
    return showNotification(`👋 ${username} joined the chat`, {
      body: 'Say hello!',
      icon: '/favicon.ico'
    })
  }

  const showUserLeftNotification = (username) => {
    return showNotification(`👋 ${username} left the chat`, {
      icon: '/favicon.ico'
    })
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  return {
    permission,
    soundEnabled,
    showNotification,
    showMessageNotification,
    showUserJoinedNotification,
    showUserLeftNotification,
    toggleSound,
    playNotificationSound
  }
}

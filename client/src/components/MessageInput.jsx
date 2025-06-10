import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import FileUpload from './FileUpload'

const MessageInput = ({ onSendMessage, onTyping, onFileUpload, disabled, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('')
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false)
  const textareaRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Enhanced typing handler
  const handleTyping = () => {
    // If not already typing, start typing indicator
    if (!isCurrentlyTyping) {
      setIsCurrentlyTyping(true)
      onTyping(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsCurrentlyTyping(false)
      onTyping(false)
    }, 3000)
  }

  // Stop typing immediately
  const stopTyping = () => {
    if (isCurrentlyTyping) {
      setIsCurrentlyTyping(false)
      onTyping(false)
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isCurrentlyTyping) {
        onTyping(false)
      }
    }
  }, [onTyping, isCurrentlyTyping])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message.trim() || disabled) {
      return
    }

    // Stop typing immediately when sending message
    stopTyping()

    onSendMessage(message.trim())
    setMessage('')

    // Focus back to textarea
    textareaRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      // Stop typing on Escape key
      stopTyping()
    }
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setMessage(newValue)

    // Enhanced typing logic
    if (newValue.length > 0) {
      // Start/continue typing indicator for any character input
      handleTyping()
    } else {
      // Stop typing immediately when input is completely empty
      stopTyping()
    }

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        {onFileUpload && (
          <FileUpload
            onFileUpload={onFileUpload}
            disabled={disabled}
          />
        )}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Connecting..." : placeholder}
          className="message-input"
          disabled={disabled}
          rows={1}
          maxLength={1000}
        />

        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || disabled}
          title="Send message (Enter)"
        >
          <Send size={18} />
        </button>
      </form>
      
      {message.length > 800 && (
        <div style={{ 
          fontSize: '0.8rem', 
          color: message.length > 950 ? '#dc3545' : '#6c757d',
          textAlign: 'right',
          marginTop: '5px'
        }}>
          {message.length}/1000 characters
        </div>
      )}
    </div>
  )
}

export default MessageInput

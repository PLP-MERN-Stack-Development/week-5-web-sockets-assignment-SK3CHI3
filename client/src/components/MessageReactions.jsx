import React, { useState } from 'react'
import { Smile } from 'lucide-react'

const MessageReactions = ({ message, currentUsername, onAddReaction }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡']
  
  const handleEmojiClick = (emoji) => {
    onAddReaction(message.id, emoji)
    setShowEmojiPicker(false)
  }

  const getReactionCount = (emoji) => {
    return message.reactions?.[emoji]?.length || 0
  }

  const hasUserReacted = (emoji) => {
    return message.reactions?.[emoji]?.includes(currentUsername) || false
  }

  return (
    <div className="message-reactions">
      {/* Existing reactions */}
      <div className="reactions-display">
        {message.reactions && Object.entries(message.reactions).map(([emoji, users]) => (
          users.length > 0 && (
            <button
              key={emoji}
              className={`reaction-button ${hasUserReacted(emoji) ? 'user-reacted' : ''}`}
              onClick={() => handleEmojiClick(emoji)}
              title={`${users.join(', ')} reacted with ${emoji}`}
            >
              <span className="reaction-emoji">{emoji}</span>
              <span className="reaction-count">{users.length}</span>
            </button>
          )
        ))}
      </div>

      {/* Add reaction button */}
      <div className="add-reaction">
        <button
          className="add-reaction-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add reaction"
        >
          <Smile size={14} />
        </button>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {emojis.map(emoji => (
              <button
                key={emoji}
                className="emoji-option"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageReactions

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

const MessageSearch = ({ messages, onSearchResults, currentUsername }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (term) => {
    setSearchTerm(term)
    
    if (!term.trim()) {
      setIsSearching(false)
      onSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Simple text search in messages
    const results = messages.filter(message => {
      if (message.isFile) {
        return message.fileName?.toLowerCase().includes(term.toLowerCase())
      }
      return message.message?.toLowerCase().includes(term.toLowerCase()) ||
             message.sender?.toLowerCase().includes(term.toLowerCase())
    })

    onSearchResults(results)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setIsSearching(false)
    onSearchResults([])
  }

  return (
    <div className="message-search">
      <div className="search-input-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        {isSearching && (
          <button
            onClick={clearSearch}
            className="clear-search-button"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageSearch

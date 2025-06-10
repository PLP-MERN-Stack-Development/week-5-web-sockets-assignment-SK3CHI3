import React from 'react'
import { Hash, Users } from 'lucide-react'

const RoomSelector = ({ rooms, currentRoom, onRoomSelect }) => {
  return (
    <div className="room-selector">
      <h4>
        <Hash size={16} style={{ display: 'inline', marginRight: '8px' }} />
        Rooms
      </h4>
      <div className="rooms-list">
        {rooms.map(room => (
          <div
            key={room.id}
            className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
            onClick={() => onRoomSelect(room.id)}
          >
            <Hash size={14} />
            <span className="room-name">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomSelector

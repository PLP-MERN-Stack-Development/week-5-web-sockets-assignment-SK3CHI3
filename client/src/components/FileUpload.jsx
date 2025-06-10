import React, { useRef } from 'react'
import { Paperclip, Image, FileText } from 'lucide-react'

const FileUpload = ({ onFileUpload, disabled }) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Only images, text files, and PDFs are allowed')
      return
    }

    // Convert file to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = e.target.result
      onFileUpload(file.name, fileData, file.type)
    }
    reader.readAsDataURL(file)

    // Reset input
    event.target.value = ''
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="image/*,.txt,.pdf"
        disabled={disabled}
      />
      <button
        type="button"
        className="file-upload-button"
        onClick={triggerFileSelect}
        disabled={disabled}
        title="Upload file"
      >
        <Paperclip size={16} />
      </button>
    </div>
  )
}

export default FileUpload

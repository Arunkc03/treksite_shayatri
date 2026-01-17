import React, { useState } from 'react'

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setError(null)

    // Create a local preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target.result)
      setImageUrl(event.target.result)
      setLoading(false)
    }
    reader.onerror = () => {
      setError('Failed to read file')
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setImageUrl(url)
    if (url) {
      setPreviewImage(url)
    }
  }

  const handleClear = () => {
    setImageUrl('')
    setPreviewImage(null)
    setError(null)
  }

  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ margin: '0 0 16px', color: 'var(--primary)' }}>Upload Image</h3>
      
      <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        {/* File Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Choose from device:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg-light)',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>

        {/* URL Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Or paste image URL:
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg-light)',
              color: 'var(--text-dark)',
              width: '100%'
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: 'var(--danger)',
            background: 'rgba(214, 69, 69, 0.1)',
            padding: '10px 12px',
            borderRadius: '8px',
            borderLeft: '3px solid var(--danger)'
          }}>
            {error}
          </div>
        )}

        {/* Preview */}
        {previewImage && (
          <div style={{
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: 'var(--bg-light)',
            padding: '12px'
          }}>
            <div style={{ marginBottom: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>
              Preview:
            </div>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={() => setError('Failed to load image')}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {previewImage && (
            <button
              onClick={handleClear}
              style={{
                background: 'var(--bg-light)',
                border: '1px solid var(--border)',
                color: 'var(--text-dark)',
                padding: '10px 16px',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(45, 80, 22, 0.08)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--bg-light)'}
            >
              Clear
            </button>
          )}
          {loading && (
            <span style={{ color: 'var(--text-muted)', paddingTop: '10px' }}>Loading...</span>
          )}
        </div>
      </div>
    </div>
  )
}

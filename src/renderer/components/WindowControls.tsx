import { useEffect, useState } from 'react'
import './WindowControls.css'

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const checkMaximized = () => {
      setIsMaximized(window.electronAPI ? false : false)
    }
    checkMaximized()
  }, [])

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow()
  }

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow()
    setIsMaximized(!isMaximized)
  }

  const handleClose = () => {
    window.electronAPI?.closeWindow()
  }

  return (
    <div className="window-controls">
      <button className="control-btn minimize" onClick={handleMinimize}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      
      <button className="control-btn maximize" onClick={handleMaximize}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          {isMaximized ? (
            <path d="M4 4h6v6H4zM10 4v6h-6V4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          ) : (
            <path d="M3 3h8v8H3zM11 3v8h-8V3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          )}
        </svg>
      </button>
      
      <button className="control-btn close" onClick={handleClose}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
    </div>
  )
}

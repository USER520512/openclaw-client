import './InstallStep.css'

interface InstallStepProps {
  progress: number
  status: string
}

export function InstallStep({ progress, status }: InstallStepProps) {
  return (
    <div className="install-step">
      <h2>Installing OpenClaw</h2>
      <p className="subtitle">Please wait while we set everything up...</p>

      <div className="progress-container">
        <div className="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle
              className="progress-bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="progress-bar"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${progress * 2.83} 283`,
                opacity: 1
              }}
            />
          </svg>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>

      <div className="status-container">
        <div className="status-indicator">
          <div className="spinner"></div>
        </div>
        <span className="status-text">{status || '准备中...'}</span>
      </div>

      <div className="progress-details">
        <div className="detail-item">
          <span className="detail-label">Downloading components</span>
          <div className="detail-bar">
            <div className="detail-fill" style={{ width: `${Math.min(progress * 1.5, 100)}%` }}></div>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-label">Installing dependencies</span>
          <div className="detail-bar">
            <div className="detail-fill" style={{ width: `${Math.max(0, Math.min((progress - 40) * 1.67, 100))}%` }}></div>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-label">Configuring</span>
          <div className="detail-bar">
            <div className="detail-fill" style={{ width: `${Math.max(0, Math.min((progress - 80) * 5, 100))}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

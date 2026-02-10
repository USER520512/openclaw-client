import './InstallStep.css'

interface InstallStepProps {
  progress: number
  status: string
  error?: string
  onRetry?: () => void
}

export function InstallStep({ progress, status, error, onRetry }: InstallStepProps) {
  return (
    <div className="install-step">
      <h2>{error ? '安装遇到问题' : '正在安装 OpenClaw'}</h2>
      <p className="subtitle">
        {error ? '请检查网络连接后重试' : '正在通过 npm 安装，请稍候...'}
      </p>

      <div className="progress-container">
        <div className="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle className="progress-bg" cx="50" cy="50" r="45" />
            <circle
              className={`progress-bar ${error ? 'error' : ''}`}
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${progress * 2.83} 283`,
                opacity: 1
              }}
            />
          </svg>
          <span className="progress-text">
            {error ? '!' : `${progress}%`}
          </span>
        </div>
      </div>

      <div className="status-container">
        {!error && progress < 100 && (
          <div className="status-indicator">
            <div className="spinner"></div>
          </div>
        )}
        <span className={`status-text ${error ? 'error-text' : ''}`}>
          {error || status || '准备中...'}
        </span>
      </div>

      {error && onRetry && (
        <div className="retry-container">
          <button className="primary-btn" onClick={onRetry}>
            重新安装
          </button>
        </div>
      )}

      {!error && (
        <div className="progress-details">
          <div className="detail-item">
            <span className="detail-label">下载并安装</span>
            <div className="detail-bar">
              <div className="detail-fill" style={{ width: `${Math.min(progress * 1.25, 100)}%` }}></div>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">验证安装</span>
            <div className="detail-bar">
              <div className="detail-fill" style={{ width: `${Math.max(0, Math.min((progress - 80) * 5, 100))}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

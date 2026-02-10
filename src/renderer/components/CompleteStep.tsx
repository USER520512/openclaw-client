import './CompleteStep.css'

export function CompleteStep() {
  const handleOpenApp = () => {
    alert('OpenClaw 将在新窗口中启动！')
  }

  const handleOpenTerminal = () => {
    alert('终端命令：openclaw help')
  }

  return (
    <div className="complete-step">
      <div className="success-icon">✓</div>
      
      <h2>Installation Complete!</h2>
      <p className="subtitle">OpenClaw has been successfully installed on your system</p>

      <div className="success-details">
        <div className="detail-row">
          <span className="detail-icon">📁</span>
          <span className="detail-text">Installed to ~/.openclaw</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">⚡</span>
          <span className="detail-text">Service ready</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">🔧</span>
          <span className="detail-text">CLI available: openclaw</span>
        </div>
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <div className="steps-list">
          <div className="step-item">
            <span className="step-number">1</span>
            <div className="step-content">
              <span className="step-title">Start the service</span>
              <code>openclaw gateway start</code>
            </div>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <div className="step-content">
              <span className="step-title">Configure your channels</span>
              <code>openclaw config edit</code>
            </div>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <div className="step-content">
              <span className="step-title">Get help</span>
              <code>openclaw --help</code>
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="primary-btn" onClick={handleOpenApp}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7v2h14V7l-7-5z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 7v10M13 7v10" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Launch OpenClaw
        </button>
        <button className="secondary-btn" onClick={handleOpenTerminal}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 7l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Open Terminal
        </button>
      </div>
    </div>
  )
}

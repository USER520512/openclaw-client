import './SystemCheckStep.css'

interface SystemInfo {
  platform: string
  arch: string
  memory: number
  cpu: string
  nodeVersion: string
}

interface SystemCheckStepProps {
  systemInfo: SystemInfo | null
  onNext: () => void
  onBack: () => void
}

export function SystemCheckStep({ systemInfo, onNext, onBack }: SystemCheckStepProps) {
  const getPlatformDisplay = (platform: string) => {
    switch (platform) {
      case 'darwin': return 'macOS'
      case 'win32': return 'Windows'
      case 'linux': return 'Linux'
      default: return platform
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'darwin': return '🍎'
      case 'win32': return '🪟'
      case 'linux': return '🐧'
      default: return '💻'
    }
  }

  const checks = [
    {
      name: 'Operating System',
      status: 'good',
      detail: getPlatformDisplay(systemInfo?.platform || 'unknown') + ` (${systemInfo?.arch})`,
      icon: getPlatformIcon(systemInfo?.platform || 'unknown')
    },
    {
      name: 'Node.js',
      status: systemInfo?.nodeVersion ? 'good' : 'warning',
      detail: systemInfo?.nodeVersion || 'Not detected',
      icon: '🟢'
    },
    {
      name: 'Architecture',
      status: 'good',
      detail: systemInfo?.arch === 'arm64' ? 'Apple Silicon / ARM64' : 'x64',
      icon: '⚙️'
    }
  ]

  return (
    <div className="system-check-step">
      <h2>System Check</h2>
      <p className="subtitle">Let's make sure your system is ready</p>

      <div className="checks-container">
        {checks.map((check, index) => (
          <div key={index} className={`check-item ${check.status}`}>
            <span className="check-icon">{check.icon}</span>
            <div className="check-content">
              <span className="check-name">{check.name}</span>
              <span className="check-detail">{check.detail}</span>
            </div>
            <span className={`check-status ${check.status}`}>
              {check.status === 'good' ? '✓' : '!'}
            </span>
          </div>
        ))}
      </div>

      <div className="requirements-info">
        <h3>Requirements</h3>
        <ul>
          <li>macOS 10.15+ or Windows 10+</li>
          <li>At least 500MB of free disk space</li>
          <li>Administrator privileges for installation</li>
        </ul>
      </div>

      <div className="actions">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
        <button className="primary-btn" onClick={onNext}>
          Continue
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M12 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

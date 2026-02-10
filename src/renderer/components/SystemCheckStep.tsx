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
      name: '操作系统',
      status: 'good',
      detail: getPlatformDisplay(systemInfo?.platform || 'unknown') + ` (${systemInfo?.arch})`,
      icon: getPlatformIcon(systemInfo?.platform || 'unknown')
    },
    {
      name: 'Node.js',
      status: systemInfo?.nodeVersion ? 'good' : 'warning',
      detail: systemInfo?.nodeVersion || '未检测到',
      icon: '🟢'
    },
    {
      name: '系统架构',
      status: 'good',
      detail: systemInfo?.arch === 'arm64' ? 'Apple Silicon / ARM64' : 'x64',
      icon: '⚙️'
    }
  ]

  return (
    <div className="system-check-step">
      <h2>系统检测</h2>
      <p className="subtitle">确认您的系统满足安装要求</p>

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

      {!systemInfo?.nodeVersion && (
        <div className="node-warning">
          <div className="node-warning-header">
            <span className="node-warning-icon">&#9888;</span>
            <span className="node-warning-title">未检测到 Node.js 环境</span>
          </div>
          <p className="node-warning-text">
            OpenClaw 需要 Node.js 运行环境才能正常工作。请先安装 Node.js（建议 v18 或更高版本），然后重新打开本安装程序。
          </p>
          <button
            className="node-download-btn"
            onClick={() => window.electronAPI?.openExternalUrl('https://nodejs.org/zh-cn')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            前往下载 Node.js
          </button>
        </div>
      )}

      <div className="requirements-info">
        <h3>系统要求</h3>
        <ul>
          <li>macOS 10.15+ 或 Windows 10+</li>
          <li>至少 500MB 可用磁盘空间</li>
          <li>安装过程需要管理员权限</li>
          <li>Node.js v18 或更高版本</li>
        </ul>
      </div>

      <div className="actions">
        <button className="secondary-btn" onClick={onBack}>
          返回
        </button>
        <button className="primary-btn" onClick={onNext}>
          继续安装
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M12 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

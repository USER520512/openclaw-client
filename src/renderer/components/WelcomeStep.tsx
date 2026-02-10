import './WelcomeStep.css'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="welcome-step">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">⚡</span>
        </div>
        <h1 className="title">OpenClaw</h1>
        <p className="subtitle">桌面客户端</p>
      </div>

      <div className="description">
        <p>欢迎使用 OpenClaw 桌面客户端！</p>
        <p>安装程序将在您的计算机上部署 OpenClaw，并提供精美的图形化操作界面。</p>
      </div>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">🌐</span>
          <span>跨平台支持</span>
        </div>
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span>快速轻量</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <span>安全可靠</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔄</span>
          <span>自动更新</span>
        </div>
      </div>

      <button className="primary-btn" onClick={onNext}>
        开始安装
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

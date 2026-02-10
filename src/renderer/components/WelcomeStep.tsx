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
        <p className="subtitle">Desktop Client</p>
      </div>

      <div className="description">
        <p>Welcome to OpenClaw Desktop Client!</p>
        <p>This installer will set up OpenClaw on your computer with a beautiful graphical interface.</p>
      </div>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">🌐</span>
          <span>Cross-Platform</span>
        </div>
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span>Fast & Lightweight</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <span>Secure</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔄</span>
          <span>Auto-Updates</span>
        </div>
      </div>

      <button className="primary-btn" onClick={onNext}>
        Get Started
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

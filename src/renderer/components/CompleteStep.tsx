import { useState } from 'react'
import './CompleteStep.css'

declare global {
  interface Window {
    electronAPI?: {
      getPlatform: () => Promise<string>
      getSystemInfo: () => Promise<unknown>
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      installOpenClaw: () => Promise<{ success: boolean; error?: string; version?: string }>
      onInstallProgress: (cb: (data: { step: string; progress: number; message: string }) => void) => void
      startGateway: () => Promise<{ success: boolean; message: string }>
      onGatewayStatus: (cb: (data: { status: string; message: string }) => void) => void
      openDashboard: () => void
      openTerminal: () => void
      openExternalUrl: (url: string) => void
    }
  }
}

export function CompleteStep() {
  const [gatewayStatus, setGatewayStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleLaunch = async () => {
    setGatewayStatus('starting')
    setStatusMessage('正在启动 OpenClaw 网关...')

    try {
      const result = await window.electronAPI?.startGateway()
      if (result?.success) {
        setGatewayStatus('running')
        setStatusMessage('网关已启动！正在打开控制面板...')
        // 延迟 1 秒打开面板，让用户看到成功提示
        setTimeout(() => {
          window.electronAPI?.openDashboard()
        }, 1000)
      } else {
        setGatewayStatus('error')
        setStatusMessage(result?.message || '启动失败')
      }
    } catch {
      setGatewayStatus('error')
      setStatusMessage('启动过程发生异常')
    }
  }

  const handleOpenDashboard = () => {
    window.electronAPI?.openDashboard()
  }

  const handleOpenTerminal = () => {
    window.electronAPI?.openTerminal()
  }

  return (
    <div className="complete-step">
      <div className="success-icon">&#10003;</div>
      
      <h2>安装完成！</h2>
      <p className="subtitle">OpenClaw 已成功安装到您的系统</p>

      <div className="success-details">
        <div className="detail-row">
          <span className="detail-icon">&#9889;</span>
          <span className="detail-text">OpenClaw 已安装并可用</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">&#127760;</span>
          <span className="detail-text">Web 控制面板地址：http://localhost:18789</span>
        </div>
      </div>

      {/* 网关状态提示 */}
      {gatewayStatus === 'starting' && (
        <div className="gateway-status starting">
          <div className="gateway-spinner"></div>
          <span>{statusMessage}</span>
        </div>
      )}
      {gatewayStatus === 'running' && (
        <div className="gateway-status running">
          <span className="gateway-check">&#10003;</span>
          <span>{statusMessage}</span>
        </div>
      )}
      {gatewayStatus === 'error' && (
        <div className="gateway-status error">
          <span className="gateway-error-icon">!</span>
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="next-steps">
        <h3>接下来做什么？</h3>
        <p className="next-steps-desc">
          点击下方按钮启动 OpenClaw 网关服务，然后在浏览器中打开控制面板进行配置。
          您可以在面板中设置 AI 模型、连接聊天平台、管理技能等。
        </p>
      </div>

      <div className="actions">
        {gatewayStatus === 'running' ? (
          <button className="primary-btn" onClick={handleOpenDashboard}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            打开控制面板
          </button>
        ) : (
          <button
            className="primary-btn"
            onClick={handleLaunch}
            disabled={gatewayStatus === 'starting'}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4l10 6-10 6V4z" fill="currentColor"/>
            </svg>
            {gatewayStatus === 'starting' ? '正在启动...' : '启动 OpenClaw'}
          </button>
        )}
        <button className="secondary-btn" onClick={handleOpenTerminal}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 7l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          打开终端
        </button>
      </div>
    </div>
  )
}

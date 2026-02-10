import { useState, useEffect } from 'react'
import { WindowControls } from './components/WindowControls'
import { WelcomeStep } from './components/WelcomeStep'
import { SystemCheckStep } from './components/SystemCheckStep'
import { InstallStep } from './components/InstallStep'
import { CompleteStep } from './components/CompleteStep'
import './App.css'

type Step = 'welcome' | 'system-check' | 'install' | 'complete'

export interface SystemInfo {
  platform: string
  arch: string
  memory: number
  cpu: string
  nodeVersion: string
  openclawVersion: string
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStatus, setInstallStatus] = useState('')
  const [installError, setInstallError] = useState('')

  useEffect(() => {
    window.electronAPI?.getSystemInfo().then((info: SystemInfo) => {
      setSystemInfo(info)
    })
  }, [])

  // 监听安装进度
  useEffect(() => {
    window.electronAPI?.onInstallProgress((data: { progress: number; message: string }) => {
      setInstallProgress(data.progress)
      setInstallStatus(data.message)
    })
  }, [])

  const handleNext = () => {
    const steps: Step[] = ['welcome', 'system-check', 'install', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['welcome', 'system-check', 'install', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleInstall = async () => {
    setCurrentStep('install')
    setInstallProgress(0)
    setInstallStatus('准备中...')
    setInstallError('')

    try {
      const result = await window.electronAPI?.installOpenClaw()
      if (result?.success) {
        setCurrentStep('complete')
      } else {
        setInstallError(result?.error || '安装失败，请检查网络连接后重试')
      }
    } catch {
      setInstallError('安装过程发生异常')
    }
  }

  return (
    <div className="app">
      <WindowControls />
      
      <main className="main-content">
        {currentStep === 'welcome' && (
          <WelcomeStep onNext={handleNext} />
        )}
        
        {currentStep === 'system-check' && (
          <SystemCheckStep 
            systemInfo={systemInfo}
            onNext={handleInstall}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'install' && (
          <InstallStep 
            progress={installProgress}
            status={installStatus}
            error={installError}
            onRetry={handleInstall}
          />
        )}
        
        {currentStep === 'complete' && (
          <CompleteStep />
        )}
      </main>

      <footer className="footer">
        <span className="version">OpenClaw Client v1.0.0</span>
      </footer>
    </div>
  )
}

export default App

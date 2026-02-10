import { useState, useEffect } from 'react'
import { WindowControls } from './components/WindowControls'
import { WelcomeStep } from './components/WelcomeStep'
import { SystemCheckStep } from './components/SystemCheckStep'
import { InstallStep } from './components/InstallStep'
import { CompleteStep } from './components/CompleteStep'
import './App.css'

type Step = 'welcome' | 'system-check' | 'install' | 'complete'

interface SystemInfo {
  platform: string
  arch: string
  memory: number
  cpu: string
  nodeVersion: string
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStatus, setInstallStatus] = useState('')

  useEffect(() => {
    window.electronAPI?.getPlatform().then((platform: string) => {
      setSystemInfo({
        platform,
        arch: process.arch,
        memory: 0,
        cpu: '',
        nodeVersion: process.version
      })
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
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setInstallProgress(i)
      setInstallStatus(i < 30 ? '下载组件...' : i < 60 ? '安装依赖...' : i < 90 ? '配置中...' : '完成!')
    }
    setCurrentStep('complete')
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

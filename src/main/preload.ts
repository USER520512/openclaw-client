import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 系统信息
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  // 安装
  installOpenClaw: () => ipcRenderer.invoke('install-openclaw'),
  onInstallProgress: (callback: (data: { step: string; progress: number; message: string }) => void) => {
    ipcRenderer.on('install-progress', (_event, data) => callback(data))
  },
  // 网关
  startGateway: () => ipcRenderer.invoke('start-gateway'),
  onGatewayStatus: (callback: (data: { status: string; message: string }) => void) => {
    ipcRenderer.on('gateway-status', (_event, data) => callback(data))
  },
  // 面板 & 工具
  openDashboard: () => ipcRenderer.invoke('open-dashboard'),
  openTerminal: () => ipcRenderer.invoke('open-terminal'),
  openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url)
})

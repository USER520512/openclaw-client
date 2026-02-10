/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getPlatform: () => Promise<string>
    minimizeWindow: () => Promise<void>
    maximizeWindow: () => Promise<void>
    closeWindow: () => Promise<void>
  }
}

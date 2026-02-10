import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e'
  })

  win.loadURL('http://localhost:5173')
  
  // 开发模式打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
ipcMain.handle('get-platform', () => {
  return process.platform
})

ipcMain.handle('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.minimize()
})

ipcMain.handle('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})

ipcMain.handle('close-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.close()
})

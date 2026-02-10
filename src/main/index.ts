import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import path from 'path'
import os from 'os'
import { exec, spawn, ChildProcess } from 'child_process'

// 用登录 shell 确保 nvm/fnm 等 PATH 生效
function shellCmd(cmd: string): string {
  const platform = process.platform
  if (platform === 'win32') return cmd
  return `/bin/zsh -lc "${cmd}"`
}

function execShell(cmd: string, timeout = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(shellCmd(cmd), { timeout }, (error, stdout) => {
      if (error) reject(error)
      else resolve(stdout.trim())
    })
  })
}

let gatewayProcess: ChildProcess | null = null

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e'
  })

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (gatewayProcess) {
    gatewayProcess.kill()
    gatewayProcess = null
  }
  if (process.platform !== 'darwin') app.quit()
})

// ========== 窗口控制 ==========
ipcMain.handle('minimize-window', () => {
  BrowserWindow.getFocusedWindow()?.minimize()
})
ipcMain.handle('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.handle('close-window', () => {
  BrowserWindow.getFocusedWindow()?.close()
})

// ========== 系统检测 ==========
ipcMain.handle('get-platform', () => process.platform)

ipcMain.handle('get-system-info', async () => {
  const platform = process.platform
  const arch = process.arch
  const memory = os.totalmem()
  const cpus = os.cpus()
  const cpu = cpus.length > 0 ? cpus[0].model : ''

  let nodeVersion = ''
  try {
    nodeVersion = await execShell('node --version', 5000)
  } catch {
    nodeVersion = ''
  }

  // 检测 openclaw 是否已安装
  let openclawVersion = ''
  try {
    openclawVersion = await execShell('openclaw --version', 5000)
  } catch {
    openclawVersion = ''
  }

  return { platform, arch, memory, cpu, nodeVersion, openclawVersion }
})

// ========== 安装 OpenClaw ==========
ipcMain.handle('install-openclaw', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const send = (channel: string, data: unknown) => {
    win?.webContents.send(channel, data)
  }

  try {
    // 第 1 步：检测是否已安装
    send('install-progress', { step: 'check', progress: 5, message: '检查现有安装...' })
    let alreadyInstalled = false
    try {
      await execShell('openclaw --version', 5000)
      alreadyInstalled = true
    } catch {
      alreadyInstalled = false
    }

    if (alreadyInstalled) {
      send('install-progress', { step: 'check', progress: 10, message: '检测到已安装 OpenClaw，正在更新到最新版...' })
    } else {
      send('install-progress', { step: 'download', progress: 10, message: '正在通过 npm 安装 OpenClaw...' })
    }

    // 第 2 步：通过 npm 全局安装
    await new Promise<void>((resolve, reject) => {
      const cmd = shellCmd('npm install -g openclaw@latest 2>&1')
      const child = exec(cmd, { timeout: 120000 })

      let output = ''
      child.stdout?.on('data', (data: string) => {
        output += data
        // 根据输出内容估算进度
        const progress = Math.min(15 + Math.floor(output.length / 50), 75)
        send('install-progress', { step: 'install', progress, message: '正在安装 OpenClaw...' })
      })

      child.stderr?.on('data', (data: string) => {
        output += data
      })

      child.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`安装失败 (exit code: ${code})\n${output}`))
      })

      child.on('error', reject)
    })

    send('install-progress', { step: 'install', progress: 80, message: '安装完成，正在验证...' })

    // 第 3 步：验证安装
    let version = ''
    try {
      version = await execShell('openclaw --version', 5000)
    } catch {
      // 忽略
    }

    send('install-progress', { step: 'done', progress: 100, message: version ? `安装成功！版本: ${version}` : '安装完成！' })

    return { success: true, version }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    send('install-progress', { step: 'error', progress: 0, message: `安装失败: ${message}` })
    return { success: false, error: message }
  }
})

// ========== 启动网关 ==========
ipcMain.handle('start-gateway', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)

  // 如果已经在运行，直接返回
  if (gatewayProcess && !gatewayProcess.killed) {
    return { success: true, message: '网关已在运行中' }
  }

  try {
    // 先检查 18789 端口是否已被占用（说明 gateway 已在运行）
    try {
      await execShell('curl -s http://127.0.0.1:18789/ > /dev/null', 3000)
      return { success: true, message: '网关已在运行中' }
    } catch {
      // 端口未占用，继续启动
    }

    win?.webContents.send('gateway-status', { status: 'starting', message: '正在启动 OpenClaw 网关...' })

    // 启动 gateway 进程
    const cmd = process.platform === 'win32' ? 'openclaw' : '/bin/zsh'
    const args = process.platform === 'win32'
      ? ['gateway', '--port', '18789']
      : ['-lc', 'openclaw gateway --port 18789']

    gatewayProcess = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    })

    // 等待网关启动（最多 15 秒）
    let started = false
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 500))
      try {
        await execShell('curl -s http://127.0.0.1:18789/ > /dev/null', 2000)
        started = true
        break
      } catch {
        // 继续等待
      }
    }

    if (started) {
      win?.webContents.send('gateway-status', { status: 'running', message: '网关启动成功！' })
      return { success: true, message: '网关启动成功' }
    } else {
      win?.webContents.send('gateway-status', { status: 'error', message: '网关启动超时' })
      return { success: false, message: '网关启动超时，请手动运行: openclaw gateway' }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    win?.webContents.send('gateway-status', { status: 'error', message })
    return { success: false, message }
  }
})

// ========== 打开控制面板 ==========
ipcMain.handle('open-dashboard', async () => {
  await shell.openExternal('http://127.0.0.1:18789/')
})

// ========== 通用 ==========
ipcMain.handle('open-terminal', () => {
  const platform = process.platform
  if (platform === 'darwin') exec('open -a Terminal')
  else if (platform === 'win32') exec('start cmd')
  else exec('x-terminal-emulator || gnome-terminal || konsole || xterm')
})

ipcMain.handle('open-external-url', async (_event, url: string) => {
  await shell.openExternal(url)
})

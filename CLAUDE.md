# OpenClaw Desktop Client

跨平台 GUI 安装器，支持 macOS 和 Windows。

## 技术栈

- **框架**: Electron 28 + React 18 + TypeScript 5
- **构建**: Vite 5 + electron-builder
- **UI**: 自定义组件（无 UI 库依赖）
- **平台**: macOS 10.15+ / Windows 10+

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 创建安装包
npm run dist

# 预览打包结果
npm run preview
```

## 项目结构

```
openclaw-client/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 窗口管理 + IPC
│   │   └── preload.ts  # 安全桥梁
│   └── renderer/       # React UI
│       ├── components/  # 页面组件
│       ├── App.tsx     # 主应用
│       └── index.tsx   # 入口
├── package.json
├── vite.config.ts
├── electron-builder.json5
└── tsconfig.json
```

## 开发流程

### 1. 新功能开发
1. 创建对应组件（src/renderer/components/）
2. 在 App.tsx 中添加路由
3. 测试功能

### 2. 测试清单
- [ ] macOS 窗口控制正常
- [ ] Windows 窗口控制正常
- [ ] 4 步向导流转正确
- [ ] 进度动画流畅
- [ ] 无 console 错误

### 3. 构建测试
```bash
npm run build
npm run dist
```

### 4. 交付前检查
- [ ] 版本号已更新 (package.json)
- [ ] README.md 文档完整
- [ ] 无临时文件
- [ ] git commit 已完成

## 代码风格

- TypeScript 严格模式
- 函数组件 + Hooks
- CSS 模块化（.css 文件）
- IPC 通信使用 preload 桥接
- 主进程处理系统级操作，渲染进程处理 UI

## 常见任务

### 添加新页面
1. 在 `src/renderer/components/` 创建 `XXXStep.tsx`
2. 在 `App.tsx` 的 steps 数组中添加
3. 添加路由逻辑

### 添加 IPC 通信
1. 主进程: `ipcMain.handle('xxx', ...)`
2. preload: `contextBridge.exposeInMainWorld('electronAPI', ...)`
3. 渲染进程: `window.electronAPI.xxx()`

### 修改窗口行为
编辑 `src/main/index.ts`

## 注意事项

- 不要修改 `electron-builder.json5` 的 appId
- macOS 使用公证需要额外配置签名
- Windows Defender 可能误报病毒（白名单）

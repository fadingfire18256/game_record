# 快速開始指南

## 前置準備

1. **註冊 Neon 帳號** → https://neon.tech
   - 創建新專案和數據庫
   - 複製連接字串

2. **註冊 Cloudflare 帳號** → https://cloudflare.com
   - 用於部署後端 API

## 本地開發（5 分鐘啟動）

### 1. 安裝依賴

```bash
# 前端
cd frontend
npm install

# 後端
cd ../backend
npm install

# 數據庫工具（可選）
cd ../database
npm install
```

### 2. 初始化數據庫

```bash
cd database
DATABASE_URL="你的Neon連接字串" npm run init
```

或者直接在 Neon SQL Editor 中執行 `database/schema.sql` 的內容。

### 3. 配置環境變數

**後端** (`backend/.dev.vars`):
```bash
cd backend
cp .dev.vars.example .dev.vars
# 編輯 .dev.vars，填入你的 DATABASE_URL
```

**前端** (`frontend/.env`):
```bash
cd frontend
echo "VITE_API_URL=http://localhost:8787/api" > .env
```

### 4. 啟動開發服務器

開兩個終端：

**終端 1 - 後端:**
```bash
cd backend
npm run dev
```

**終端 2 - 前端:**
```bash
cd frontend
npm run dev
```

### 5. 訪問應用

打開瀏覽器訪問 http://localhost:3000

## 測試流程

1. 註冊新用戶
2. 登入系統
3. 點擊「紀錄按鈕」添加桌遊記錄
4. 點擊「統計按鈕」查看數據

## 部署到生產環境

### 部署後端

```bash
cd backend
wrangler login
wrangler deploy
```

記住 Worker URL，例如：`https://game-recorder-backend.your-name.workers.dev`

### 部署前端

1. 更新前端環境變數：
```bash
echo "VITE_API_URL=https://your-worker-url/api" > frontend/.env.production
```

2. 構建並部署：
```bash
cd frontend
npm run build
# 將 dist/ 目錄部署到 GitHub Pages 或其他靜態托管服務
```

## 故障排除

### 後端無法啟動
- 檢查 `DATABASE_URL` 是否正確
- 確保 Neon 數據庫處於活動狀態

### 前端無法連接後端
- 確保後端運行在 `localhost:8787`
- 檢查 `.env` 配置

### 數據庫連接失敗
- 驗證連接字串格式：`postgresql://user:password@host/database?sslmode=require`
- 確認數據庫已初始化（執行過 schema.sql）

## 下一步

- 閱讀 `ARCHITECTURE.md` 了解系統架構
- 閱讀 `database/README.md` 了解數據庫設計
- 開始添加新功能！

# 桌遊紀錄系統 (Board Game Recorder)

一個用於記錄和統計桌遊遊玩資料的系統。

## 技術棧

### 前端
- **框架**: Vue.js 3
- **語言**: JavaScript
- **部署**: GitHub Pages

### 後端
- **平台**: Cloudflare Workers
- **語言**: TypeScript
- **API**: RESTful API

### 數據庫
- **服務**: Neon (Serverless PostgreSQL)
- **ORM**: 待定

## 專案結構

```
game_recorder/
├── frontend/          # Vue.js 前端應用
├── backend/           # Cloudflare Workers 後端
├── database/          # 數據庫 schema 和遷移腳本
├── ARCHITECTURE.md    # 系統架構文檔
└── README.md          # 專案說明
```

## 功能特性

### 1. 用戶認證
- 用戶註冊
- 用戶登入

### 2. 遊戲紀錄
- 記錄桌遊名稱
- 記錄遊玩日期時間（精確到分鐘）
- 記錄多位玩家及其分數

### 3. 統計查詢
- 按玩家名稱查詢歷史記錄
- 按日期查詢遊戲記錄
- 支援多維度數據展示

### 4. 數據同步
- 跨裝置同步
- 跨程式同步

## 開發指南

### 前端開發
```bash
cd frontend
npm install
npm run dev
```

### 後端開發
```bash
cd backend
npm install
npm run dev
```

### 數據庫設置
詳見 `database/README.md`

## 部署

### 前端部署
前端部署到 GitHub Pages

### 後端部署
```bash
cd backend
npm run deploy
```

## 授權
MIT License

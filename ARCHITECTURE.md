# 桌遊紀錄系統 - 架構說明文檔

## 系統概述
這是一個桌遊紀錄與統計系統，允許用戶記錄桌遊遊玩情況，包括玩家、分數、時間等資訊，並提供多維度的統計查詢功能。

---

## 1. 用戶認證模塊

### 1.1 首頁 (First Page)
- 系統介紹頁面
- 提供註冊/登入選項

### 1.2 用戶註冊 (User Register Page)
**輸入欄位：**
- User ID（用戶帳號）
- Password（密碼）

**操作：** 按下完成按鈕提交註冊

### 1.3 用戶登入 (User Login Page)
**輸入欄位：**
- User ID（用戶帳號）
- Password（密碼）
- Submit（提交）

**操作：** 按下完成按鈕進行登入

---

## 2. 主頁面 (Main Page)

### 功能概覽
登入後顯示用戶的 Performance 和 Statistic

### 主要功能按鈕
- **紀錄按鈕** → 進入記錄頁面
- **統計按鈕** → 進入統計頁面

---

## 3. 紀錄功能模塊 (Record Page)

### 3.1 輸入欄位 (Input Bar)
1. **桌遊名稱** (Game Name)
2. **日期** (Play Date)
   - 格式：年月日 + 時分（例如：2024-12-14 14:30）
3. **玩家名稱** (Player Name)
   - 支援多位玩家
4. **玩家分數** (Player Score)
   - 每位玩家對應一個分數

### 3.2 操作流程
1. 填寫所有必填欄位
2. 按下「完成按鈕」(press complete button)
3. 資料儲存至資料庫

---

## 4. 統計功能模塊 (Statistic Page)

### 4.1 查詢流程

#### 第一步：選擇桌遊
- 顯示目前已記錄過的所有桌遊名稱
- 用戶點擊選擇特定桌遊

#### 第二步：選擇查詢維度
選擇桌遊後，系統提供兩種查詢方式：

##### A. 按玩家名稱查詢
**操作流程：**
1. 顯示該桌遊已記錄過的所有玩家名稱
2. 用戶點擊特定玩家名稱
3. 系統顯示：
   - 該玩家在該遊戲的所有遊玩記錄
   - 每筆記錄包含：日期（年月日時分）+ 該場次所有玩家資訊
   - **排序方式：以玩家名稱優先排序**

**顯示內容：**
```
玩家：Alice
遊戲：卡坦島
-------------------------
日期：2024-12-14 14:30
玩家：Alice (85分), Bob (72分), Charlie (68分)

日期：2024-12-10 19:00
玩家：Alice (90分), David (78分), Eve (82分)
```

##### B. 按日期查詢
**操作流程：**
1. 顯示該桌遊已記錄過的所有日期
2. 用戶點擊特定日期
3. 系統顯示：
   - 該日期該遊戲的所有遊玩記錄
   - 每筆記錄包含：所有玩家名稱 + 對應分數
   - **排序方式：以日期優先排序**

**顯示內容：**
```
遊戲：卡坦島
日期：2024-12-14 14:30
-------------------------
玩家：Alice (85分)
玩家：Bob (72分)
玩家：Charlie (68分)
```

### 4.2 按鈕功能
- **date** - 按日期篩選
- **date_filter** - 日期過濾器
- **press date button** - 按下日期按鈕顯示數據
- **display date + player data** - 顯示日期與玩家數據

---

## 5. 資料管理模塊 (Mapping Table)

### 5.1 資料結構
```
用戶資料：
- user_id (用戶ID)
- username (用戶名稱)

遊戲紀錄 (pengame record)：
- date (日期，包含年月日時分)
- game_name (桌遊名稱)
- player (玩家名稱)
- player_score (玩家分數)
```

### 5.2 資料關聯
- 一個用戶可以有多筆遊戲紀錄
- 一筆遊戲紀錄包含多位玩家
- 每位玩家對應一個分數

---

## 6. 技術架構

### 6.1 技術棧

#### 前端
- **框架:** Vue.js 3
- **構建工具:** Vite
- **狀態管理:** Pinia
- **路由:** Vue Router
- **HTTP 客戶端:** Axios
- **部署:** GitHub Pages

#### 後端
- **平台:** Cloudflare Workers
- **語言:** TypeScript
- **框架:** Hono (輕量級 Web 框架)
- **API 風格:** RESTful API
- **認證:** JWT (JSON Web Tokens)

#### 資料庫
- **服務:** Neon (Serverless PostgreSQL)
- **客戶端:** @neondatabase/serverless
- **數據格式:** JSON/JSONB (用於存儲玩家陣列)

### 6.2 專案結構

```
game_recorder/
├── frontend/              # Vue.js 前端應用
│   ├── src/
│   │   ├── components/   # Vue 組件
│   │   ├── views/        # 頁面組件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Pinia 狀態管理
│   │   ├── api/          # API 請求封裝
│   │   └── assets/       # 靜態資源
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Cloudflare Workers 後端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── db/           # 數據庫連接
│   │   ├── utils/        # 工具函數
│   │   └── types/        # TypeScript 類型定義
│   ├── package.json
│   ├── wrangler.toml     # Cloudflare 配置
│   └── tsconfig.json
│
├── database/              # 數據庫相關
│   ├── schema.sql        # 數據庫 Schema
│   ├── init-db.js        # 初始化腳本
│   └── README.md         # 數據庫設置指南
│
├── ARCHITECTURE.md        # 本文檔
└── README.md             # 專案說明
```

### 6.3 API 端點設計

#### 認證相關
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/logout` - 用戶登出

#### 遊戲紀錄相關
- `POST /api/games/record` - 創建遊戲紀錄
- `GET /api/games/list` - 獲取遊戲列表
- `GET /api/games/:gameName/players` - 獲取特定遊戲的玩家列表
- `GET /api/games/:gameName/dates` - 獲取特定遊戲的日期列表
- `GET /api/games/:gameName/player/:playerName` - 按玩家查詢記錄
- `GET /api/games/:gameName/date/:date` - 按日期查詢記錄

### 6.4 核心功能特性

1. **跨程式同步**
   - 使用 Neon PostgreSQL 雲端數據庫
   - 所有數據存儲在雲端，任何客戶端都可訪問

2. **跨裝置同步**
   - JWT Token 存儲在客戶端
   - 用戶可在不同設備登入並訪問相同數據

3. **無服務器架構**
   - Cloudflare Workers 提供全球邊緣計算
   - Neon 提供 Serverless PostgreSQL
   - 自動擴展，按需付費

4. **安全特性**
   - 密碼使用 SHA-256 哈希存儲
   - JWT Token 用於身份驗證
   - CORS 配置保護 API
   - SQL 注入防護（使用參數化查詢）

---

## 7. 系統流程圖

### 7.1 整體流程
```
用戶註冊/登入
    ↓
主頁面
    ↓
┌─────────────┬─────────────┐
│   紀錄功能   │   統計功能   │
└─────────────┴─────────────┘
    ↓               ↓
輸入桌遊資料    選擇桌遊 → 選擇查詢維度
    ↓               ↓
儲存至資料庫    顯示統計結果
```

### 7.2 資料流向
```
Vue.js 前端 → Axios HTTP 請求 → Cloudflare Workers (Hono)
                                        ↓
                              Neon PostgreSQL 資料庫
                                        ↓
                              全球邊緣網絡同步
                                        ↓
                        跨程式/跨裝置訪問相同數據
```

### 7.3 部署流程
```
開發環境:
  Frontend: npm run dev (localhost:3000)
  Backend: wrangler dev (localhost:8787)

生產環境:
  Frontend: npm run build → GitHub Pages
  Backend: wrangler deploy → Cloudflare Workers
  Database: Neon Cloud (全球可訪問)
```

---

## 8. 主要功能模塊總結

| 模塊 | 功能描述 |
|------|----------|
| 認證系統 | 用戶註冊、登入 |
| 紀錄系統 | 記錄桌遊資料（遊戲名稱、日期時間、玩家、分數） |
| 統計系統 | 多維度查詢（按玩家/按日期） |
| 資料同步 | 跨程式、跨裝置資料同步 |
| 資料存儲 | PostgreSQL 資料庫 |

---

## 9. 備註

### 日期格式
- 完整格式：YYYY-MM-DD HH:mm
- 例如：2024-12-14 14:30

### 查詢邏輯
- **按玩家查詢**：顯示該玩家的歷史記錄，以玩家為主，展示他參與的所有場次
- **按日期查詢**：顯示特定時間的遊戲記錄，以時間為主，展示該場次的所有玩家

### 排序優先級
- 玩家查詢：玩家名稱 > 日期
- 日期查詢：日期 > 玩家名稱

---

## 10. 開發指南

### 10.1 環境準備

#### 必要工具
- Node.js 18+ (推薦使用 LTS 版本)
- npm 或 yarn
- Git

#### 帳號註冊
1. [Neon](https://neon.tech) - PostgreSQL 數據庫
2. [Cloudflare](https://cloudflare.com) - Workers 部署
3. [GitHub](https://github.com) - 代碼托管和前端部署

### 10.2 本地開發設置

#### 1. 克隆專案
```bash
git clone <your-repo-url>
cd game_recorder
```

#### 2. 安裝前端依賴
```bash
cd frontend
npm install
```

#### 3. 安裝後端依賴
```bash
cd ../backend
npm install
```

#### 4. 設置數據庫
參考 `database/README.md` 設置 Neon PostgreSQL

#### 5. 配置環境變數

**後端環境變數** (`backend/.dev.vars`):
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**前端環境變數** (`frontend/.env`):
```
VITE_API_URL=http://localhost:8787/api
```

#### 6. 啟動開發服務器

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

訪問 http://localhost:3000 即可查看應用

### 10.3 部署指南

#### 部署後端到 Cloudflare Workers

1. 安裝 Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登入 Cloudflare:
```bash
wrangler login
```

3. 在 Cloudflare Dashboard 設置環境變數 `DATABASE_URL`

4. 部署:
```bash
cd backend
npm run deploy
```

#### 部署前端到 GitHub Pages

1. 更新 `frontend/.env.production`:
```
VITE_API_URL=https://your-worker.workers.dev/api
```

2. 構建項目:
```bash
cd frontend
npm run build
```

3. 推送到 GitHub 並啟用 GitHub Pages

### 10.4 開發規範

#### 代碼風格
- 使用 TypeScript (後端)
- 使用 Vue 3 Composition API (前端)
- 遵循 ESLint 規則

#### Git 提交規範
- `feat:` 新功能
- `fix:` 修復 bug
- `docs:` 文檔更新
- `style:` 代碼格式調整
- `refactor:` 代碼重構
- `test:` 測試相關
- `chore:` 構建/工具相關

### 10.5 常見問題

#### Q: CORS 錯誤
確保後端已正確配置 CORS，允許前端域名訪問。

#### Q: 數據庫連接失敗
檢查 `DATABASE_URL` 是否正確，以及 Neon 數據庫是否處於活動狀態。

#### Q: Token 過期
JWT Token 默認有效期為 7 天，過期後需要重新登入。

#### Q: 本地開發時無法連接後端
確保後端運行在 `localhost:8787`，並且前端 `.env` 配置正確。

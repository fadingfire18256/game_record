# 數據庫設置指南

本專案使用 **Neon** (Serverless PostgreSQL) 作為數據庫。

## 1. 創建 Neon 數據庫

1. 前往 [Neon](https://neon.tech) 註冊帳號
2. 創建新的專案
3. 創建新的數據庫
4. 獲取連接字串（Connection String）

連接字串格式：
```
postgresql://user:password@host/database?sslmode=require
```

## 2. 初始化數據庫

### 方法 1：使用 Neon SQL Editor

1. 在 Neon 控制台中打開 SQL Editor
2. 複製 `schema.sql` 的內容
3. 在 SQL Editor 中執行

### 方法 2：使用 psql 命令行工具

```bash
psql "postgresql://user:password@host/database?sslmode=require" -f schema.sql
```

### 方法 3：使用 Node.js 腳本

```bash
cd database
npm install
node init-db.js
```

## 3. 配置環境變數

### 後端配置

在 `backend` 目錄下創建 `.dev.vars` 文件：

```bash
cd backend
cp .dev.vars.example .dev.vars
```

編輯 `.dev.vars`，填入你的 Neon 數據庫連接字串：

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 生產環境配置

在 Cloudflare Dashboard 中設置環境變數：

1. 登入 Cloudflare Dashboard
2. 選擇你的 Worker
3. 進入 Settings → Variables
4. 添加環境變數 `DATABASE_URL`

## 4. 數據庫表結構

### users 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | SERIAL | 主鍵（自增） |
| user_id | VARCHAR(50) | 用戶 ID（唯一） |
| password_hash | VARCHAR(255) | 密碼哈希 |
| created_at | TIMESTAMP | 創建時間 |

### game_records 表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | SERIAL | 主鍵（自增） |
| user_id | VARCHAR(50) | 用戶 ID（外鍵） |
| game_name | VARCHAR(100) | 桌遊名稱 |
| play_date | TIMESTAMP | 遊玩日期時間 |
| players | JSONB | 玩家數據（JSON 格式） |
| created_at | TIMESTAMP | 創建時間 |

### players JSONB 格式
```json
[
  {
    "name": "玩家A",
    "score": 85
  },
  {
    "name": "玩家B",
    "score": 72
  }
]
```

## 5. 測試數據庫連接

在 `backend` 目錄下運行：

```bash
npm run dev
```

訪問 `http://localhost:8787` 應該會看到：
```json
{
  "message": "Game Recorder API is running"
}
```

## 6. 常見問題

### Q: 如何重置數據庫？

刪除所有表並重新執行 `schema.sql`：

```sql
DROP TABLE IF EXISTS game_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

然後重新執行 `schema.sql`。

### Q: 如何備份數據庫？

使用 `pg_dump` 命令：

```bash
pg_dump "postgresql://user:password@host/database?sslmode=require" > backup.sql
```

### Q: Neon 連接限制

Neon 免費版有以下限制：
- 最多 3 個分支
- 每月 100 小時計算時間
- 10 GB 存儲空間

對於開發和小型專案已經足夠。

## 7. 安全建議

1. **不要提交 .dev.vars 到 Git**
   - 已在 `.gitignore` 中排除

2. **使用強密碼**
   - 數據庫密碼應包含大小寫字母、數字和特殊字符

3. **定期備份**
   - 建議每週至少備份一次數據庫

4. **監控連接**
   - 在 Neon Dashboard 中監控數據庫連接和性能

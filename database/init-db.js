import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 從環境變數獲取數據庫 URL
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ 錯誤：請設置 DATABASE_URL 環境變數')
  console.error('使用方式：DATABASE_URL="your-connection-string" npm run init')
  process.exit(1)
}

async function initDatabase() {
  try {
    console.log('🔄 正在連接數據庫...')

    const sql = neon(DATABASE_URL)

    // 讀取 schema.sql 文件
    const schemaPath = join(__dirname, 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')

    console.log('🔄 正在執行數據庫初始化...')

    // 分割 SQL 語句並逐個執行
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      if (statement) {
        await sql(statement)
      }
    }

    console.log('✅ 數據庫初始化成功！')
    console.log('')
    console.log('已創建以下表：')
    console.log('  - users (用戶表)')
    console.log('  - game_records (遊戲紀錄表)')
    console.log('')
    console.log('已創建索引以優化查詢性能')

  } catch (error) {
    console.error('❌ 數據庫初始化失敗：', error.message)
    process.exit(1)
  }
}

// 執行初始化
initDatabase()

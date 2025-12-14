import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ 錯誤：請設置 DATABASE_URL 環境變數')
  process.exit(1)
}

async function initDatabase() {
  try {
    console.log('🔄 正在連接數據庫...')
    const sql = neon(DATABASE_URL)

    console.log('🔄 創建 users 表...')
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('🔄 創建 game_records 表...')
    await sql`
      CREATE TABLE IF NOT EXISTS game_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        game_name VARCHAR(100) NOT NULL,
        play_date TIMESTAMP NOT NULL,
        players JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `

    console.log('🔄 創建索引...')
    await sql`CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_game_records_user_id ON game_records(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_game_records_game_name ON game_records(game_name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_game_records_play_date ON game_records(play_date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_game_records_players ON game_records USING GIN (players)`
    await sql`CREATE INDEX IF NOT EXISTS idx_game_records_user_game ON game_records(user_id, game_name)`

    console.log('✅ 數據庫初始化成功！')
    console.log('')
    console.log('已創建：')
    console.log('  ✓ users 表')
    console.log('  ✓ game_records 表')
    console.log('  ✓ 6 個索引')

  } catch (error) {
    console.error('❌ 數據庫初始化失敗：', error.message)
    process.exit(1)
  }
}

initDatabase()

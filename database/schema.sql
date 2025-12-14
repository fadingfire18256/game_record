-- 桌遊紀錄系統數據庫 Schema

-- 創建用戶表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建遊戲紀錄表
CREATE TABLE IF NOT EXISTS game_records (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  game_name VARCHAR(100) NOT NULL,
  play_date TIMESTAMP NOT NULL,
  players JSONB NOT NULL, -- 存儲玩家數組 [{ name: string, score: number }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 創建索引以提高查詢性能
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_game_records_user_id ON game_records(user_id);
CREATE INDEX IF NOT EXISTS idx_game_records_game_name ON game_records(game_name);
CREATE INDEX IF NOT EXISTS idx_game_records_play_date ON game_records(play_date);
CREATE INDEX IF NOT EXISTS idx_game_records_players ON game_records USING GIN (players);

-- 創建複合索引
CREATE INDEX IF NOT EXISTS idx_game_records_user_game ON game_records(user_id, game_name);

// 用戶相關類型
export interface User {
  id: number
  user_id: string
  password_hash: string
  created_at: Date
}

export interface RegisterRequest {
  userId: string
  password: string
}

export interface LoginRequest {
  userId: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
}

// 遊戲紀錄相關類型
export interface Player {
  name: string
  score: number
}

export interface GameRecord {
  id: number
  user_id: string
  game_name: string
  play_date: Date
  players: Player[]
  created_at: Date
}

export interface CreateRecordRequest {
  gameName: string
  playDate: string
  players: Player[]
}

export interface GameListResponse {
  games: string[]
}

export interface PlayerListResponse {
  players: string[]
}

export interface DateListResponse {
  dates: string[]
}

export interface RecordsResponse {
  records: {
    date: string
    players: Player[]
  }[]
}

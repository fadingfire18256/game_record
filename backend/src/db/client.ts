import { neon } from '@neondatabase/serverless'
import type { Env } from '../index'

// 獲取數據庫客戶端
export function getDbClient(env: Env) {
  const sql = neon(env.DATABASE_URL)
  return sql
}

// 測試數據庫連接
export async function testConnection(env: Env): Promise<boolean> {
  try {
    const sql = getDbClient(env)
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

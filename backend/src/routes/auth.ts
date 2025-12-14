import { Hono } from 'hono'
import type { Env } from '../index'
import { getDbClient } from '../db/client'
import { hashPassword, verifyPassword, generateToken } from '../utils/auth'
import type { RegisterRequest, LoginRequest } from '../types'

const auth = new Hono<{ Bindings: Env }>()

// 註冊
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json<RegisterRequest>()
    const { userId, password } = body

    // 驗證輸入
    if (!userId || !password) {
      return c.json({ error: 'User ID and password are required' }, 400)
    }

    const sql = getDbClient(c.env)

    // 檢查用戶是否已存在
    const existingUser = await sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `

    if (existingUser.length > 0) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // 哈希密碼
    const passwordHash = await hashPassword(password)

    // 創建新用戶
    await sql`
      INSERT INTO users (user_id, password_hash)
      VALUES (${userId}, ${passwordHash})
    `

    return c.json({ message: 'User registered successfully' }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 登入
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json<LoginRequest>()
    const { userId, password } = body

    // 驗證輸入
    if (!userId || !password) {
      return c.json({ error: 'User ID and password are required' }, 400)
    }

    const sql = getDbClient(c.env)

    // 查找用戶
    const users = await sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `

    if (users.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const user = users[0]

    // 驗證密碼
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // 生成 JWT Token
    const token = generateToken(userId)

    return c.json({
      token,
      userId
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 登出（客戶端處理，後端無需操作）
auth.post('/logout', async (c) => {
  return c.json({ message: 'Logged out successfully' })
})

export default auth

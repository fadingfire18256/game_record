import { Context, Next } from 'hono'
import { verifyToken } from './auth'

// JWT 認證中間件
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)
  const userId = verifyToken(token)

  if (!userId) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // 將用戶 ID 存儲在上下文中
  c.set('userId', userId)

  await next()
}

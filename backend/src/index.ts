import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/auth'
import gameRoutes from './routes/game'

// 定義環境變數類型
export type Env = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Env }>()

// 啟用 CORS
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 健康檢查
app.get('/', (c) => {
  return c.json({ message: 'Game Recorder API is running' })
})

// 註冊路由
app.route('/api/auth', authRoutes)
app.route('/api/games', gameRoutes)

// 404 處理
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// 錯誤處理
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app

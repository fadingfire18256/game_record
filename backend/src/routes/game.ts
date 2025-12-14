import { Hono } from 'hono'
import type { Env } from '../index'
import { getDbClient } from '../db/client'
import { authMiddleware } from '../utils/middleware'
import type { CreateRecordRequest } from '../types'

const game = new Hono<{ Bindings: Env }>()

// 所有遊戲路由都需要認證
game.use('/*', authMiddleware)

// 創建遊戲紀錄
game.post('/record', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json<CreateRecordRequest>()
    const { gameName, playDate, players } = body

    // 驗證輸入
    if (!gameName || !playDate || !players || players.length === 0) {
      return c.json({ error: 'Invalid input' }, 400)
    }

    const sql = getDbClient(c.env)

    // 插入遊戲紀錄
    const result = await sql`
      INSERT INTO game_records (user_id, game_name, play_date, players)
      VALUES (${userId}, ${gameName}, ${playDate}, ${JSON.stringify(players)})
      RETURNING id
    `

    return c.json({
      message: 'Record created successfully',
      recordId: result[0].id
    }, 201)
  } catch (error) {
    console.error('Create record error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 獲取遊戲列表
game.get('/list', async (c) => {
  try {
    const userId = c.get('userId')
    const sql = getDbClient(c.env)

    const result = await sql`
      SELECT DISTINCT game_name
      FROM game_records
      WHERE user_id = ${userId}
      ORDER BY game_name
    `

    const games = result.map((row: any) => row.game_name)

    return c.json({ games })
  } catch (error) {
    console.error('Get game list error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 獲取特定遊戲的玩家列表
game.get('/:gameName/players', async (c) => {
  try {
    const userId = c.get('userId')
    const gameName = c.req.param('gameName')
    const sql = getDbClient(c.env)

    const result = await sql`
      SELECT players
      FROM game_records
      WHERE user_id = ${userId} AND game_name = ${gameName}
    `

    // 提取所有玩家名稱（去重）
    const playerSet = new Set<string>()
    result.forEach((row: any) => {
      const players = JSON.parse(row.players)
      players.forEach((player: any) => {
        playerSet.add(player.name)
      })
    })

    const players = Array.from(playerSet).sort()

    return c.json({ players })
  } catch (error) {
    console.error('Get player list error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 獲取特定遊戲的日期列表
game.get('/:gameName/dates', async (c) => {
  try {
    const userId = c.get('userId')
    const gameName = c.req.param('gameName')
    const sql = getDbClient(c.env)

    const result = await sql`
      SELECT play_date
      FROM game_records
      WHERE user_id = ${userId} AND game_name = ${gameName}
      ORDER BY play_date DESC
    `

    const dates = result.map((row: any) => row.play_date)

    return c.json({ dates })
  } catch (error) {
    console.error('Get date list error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 按玩家名稱查詢記錄
game.get('/:gameName/player/:playerName', async (c) => {
  try {
    const userId = c.get('userId')
    const gameName = c.req.param('gameName')
    const playerName = c.req.param('playerName')
    const sql = getDbClient(c.env)

    const result = await sql`
      SELECT play_date, players
      FROM game_records
      WHERE user_id = ${userId}
        AND game_name = ${gameName}
        AND players::text LIKE ${'%' + playerName + '%'}
      ORDER BY play_date DESC
    `

    const records = result.map((row: any) => ({
      date: row.play_date,
      players: JSON.parse(row.players)
    }))

    return c.json({ records })
  } catch (error) {
    console.error('Get records by player error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 按日期查詢記錄
game.get('/:gameName/date/:date', async (c) => {
  try {
    const userId = c.get('userId')
    const gameName = c.req.param('gameName')
    const date = c.req.param('date')
    const sql = getDbClient(c.env)

    const result = await sql`
      SELECT play_date, players
      FROM game_records
      WHERE user_id = ${userId}
        AND game_name = ${gameName}
        AND play_date = ${date}
      ORDER BY play_date DESC
    `

    const records = result.map((row: any) => ({
      date: row.play_date,
      players: JSON.parse(row.players)
    }))

    return c.json({ records })
  } catch (error) {
    console.error('Get records by date error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default game

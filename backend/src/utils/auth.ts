// JWT 簡單實現（用於 Cloudflare Workers）
// 注意：在生產環境中應使用更安全的實現

const JWT_SECRET = 'your-secret-key-change-this-in-production'

// 簡單的 Base64 編碼
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// 簡單的 Base64 解碼
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return atob(str)
}

// 生成 JWT Token
export function generateToken(userId: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 天過期
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // 簡化的簽名（實際應使用 crypto.subtle）
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// 驗證 JWT Token
export function verifyToken(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(parts[1]))

    // 檢查過期時間
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload.userId
  } catch (error) {
    return null
  }
}

// 密碼哈希（簡化版本，實際應使用 bcrypt 或 argon2）
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// 驗證密碼
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

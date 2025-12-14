import axios from 'axios'

// API 基礎 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器：添加認證 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 未授權，清除 token 並跳轉登入頁
      localStorage.removeItem('user_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 方法
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
}

export const gameAPI = {
  createRecord: (data) => api.post('/games/record', data),
  getGameList: () => api.get('/games/list'),
  getPlayerList: (gameName) => api.get(`/games/${gameName}/players`),
  getDateList: (gameName) => api.get(`/games/${gameName}/dates`),
  getRecordsByPlayer: (gameName, playerName) =>
    api.get(`/games/${gameName}/player/${playerName}`),
  getRecordsByDate: (gameName, date) =>
    api.get(`/games/${gameName}/date/${date}`)
}

export default api

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="card">
        <h2>用戶登入</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="userId">用戶 ID</label>
            <input
              id="userId"
              v-model="formData.userId"
              type="text"
              placeholder="請輸入用戶 ID"
              required
            />
          </div>
          <div class="input-group">
            <label for="password">密碼</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="請輸入密碼"
              required
            />
          </div>
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '登入中...' : '登入' }}
          </button>
        </form>
        <div class="footer-link">
          還沒有帳號？<router-link to="/register">立即註冊</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api'

const router = useRouter()

const formData = ref({
  userId: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await authAPI.login(formData.value)

    // 儲存 token
    localStorage.setItem('user_token', response.token)
    localStorage.setItem('user_id', response.userId)

    // 跳轉到主頁
    router.push('/main')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '登入失敗，請檢查帳號密碼'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.card {
  background: white;
  padding: 40px;
}

.card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.btn {
  width: 100%;
  margin-top: 10px;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.footer-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.footer-link a {
  color: #667eea;
  text-decoration: none;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>

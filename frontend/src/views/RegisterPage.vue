<template>
  <div class="register-page">
    <div class="register-container">
      <div class="card">
        <h2>用戶註冊</h2>
        <form @submit.prevent="handleRegister">
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
          <div class="input-group">
            <label for="confirmPassword">確認密碼</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="請再次輸入密碼"
              required
            />
          </div>
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '註冊中...' : '註冊' }}
          </button>
        </form>
        <div class="footer-link">
          已有帳號？<router-link to="/login">立即登入</router-link>
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
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // 驗證密碼
    if (formData.value.password !== formData.value.confirmPassword) {
      errorMessage.value = '兩次輸入的密碼不一致'
      return
    }

    const response = await authAPI.register({
      userId: formData.value.userId,
      password: formData.value.password
    })

    // 註冊成功，跳轉到登入頁
    alert('註冊成功！請登入')
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '註冊失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
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

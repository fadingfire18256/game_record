<template>
  <div class="home-page">
    <div class="container">
      <div class="hero">
        <h1>桌遊紀錄系統</h1>
        <p>記錄每一場精彩的桌遊對局，統計你的遊戲數據</p>
        <div class="action-buttons">
          <button class="btn btn-primary" @click="goToLogin">登入</button>
          <button class="btn btn-secondary" @click="goToRegister">註冊</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
  text-align: center;
  color: white;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-buttons .btn {
  min-width: 120px;
  font-size: 18px;
}
</style>

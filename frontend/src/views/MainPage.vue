<template>
  <div class="main-page">
    <div class="container">
      <header class="page-header">
        <h1>桌遊紀錄系統</h1>
        <div class="user-info">
          <span>用戶：{{ userId }}</span>
          <button class="btn btn-secondary" @click="handleLogout">登出</button>
        </div>
      </header>

      <div class="main-content">
        <div class="card action-card" @click="goToRecord">
          <div class="icon">📝</div>
          <h2>紀錄按鈕</h2>
          <p>記錄新的桌遊對局</p>
        </div>

        <div class="card action-card" @click="goToStatistic">
          <div class="icon">📊</div>
          <h2>統計按鈕</h2>
          <p>查看遊戲統計數據</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userId = ref('')

onMounted(() => {
  userId.value = localStorage.getItem('user_id') || '未知用戶'
})

const goToRecord = () => {
  router.push('/record')
}

const goToStatistic = () => {
  router.push('/statistic')
}

const handleLogout = () => {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_id')
  router.push('/login')
}
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: var(--background-color);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 40px;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 40px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-card .icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.action-card h2 {
  margin-bottom: 10px;
  color: #333;
}

.action-card p {
  color: #666;
  margin: 0;
}
</style>

<template>
  <div class="record-page">
    <div class="container">
      <header class="page-header">
        <button class="btn btn-secondary" @click="goBack">← 返回</button>
        <h1>紀錄新對局</h1>
      </header>

      <div class="card">
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label for="gameName">桌遊名稱 *</label>
            <input
              id="gameName"
              v-model="formData.gameName"
              type="text"
              placeholder="請輸入桌遊名稱"
              required
            />
          </div>

          <div class="input-group">
            <label for="playDate">遊玩日期時間 *</label>
            <input
              id="playDate"
              v-model="formData.playDate"
              type="datetime-local"
              required
            />
          </div>

          <div class="players-section">
            <h3>玩家資訊</h3>
            <div
              v-for="(player, index) in formData.players"
              :key="index"
              class="player-row"
            >
              <div class="input-group">
                <label>玩家名稱 {{ index + 1 }}</label>
                <input
                  v-model="player.name"
                  type="text"
                  placeholder="玩家名稱"
                  required
                />
              </div>
              <div class="input-group">
                <label>分數</label>
                <input
                  v-model.number="player.score"
                  type="number"
                  placeholder="分數"
                  required
                />
              </div>
              <button
                v-if="formData.players.length > 1"
                type="button"
                class="btn btn-danger"
                @click="removePlayer(index)"
              >
                刪除
              </button>
            </div>
            <button type="button" class="btn btn-secondary" @click="addPlayer">
              + 新增玩家
            </button>
          </div>

          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '提交中...' : '完成紀錄' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { gameAPI } from '@/api'

const router = useRouter()

const formData = ref({
  gameName: '',
  playDate: '',
  players: [
    { name: '', score: 0 },
    { name: '', score: 0 }
  ]
})

const loading = ref(false)
const errorMessage = ref('')

const addPlayer = () => {
  formData.value.players.push({ name: '', score: 0 })
}

const removePlayer = (index) => {
  formData.value.players.splice(index, 1)
}

const goBack = () => {
  router.push('/main')
}

const handleSubmit = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    await gameAPI.createRecord(formData.value)

    alert('紀錄成功！')
    router.push('/main')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '紀錄失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.record-page {
  min-height: 100vh;
  background: var(--background-color);
  padding: 20px 0;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
}

.players-section {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.players-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.player-row {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 15px;
  align-items: end;
  margin-bottom: 15px;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
  padding: 10px 15px;
}

.btn-danger:hover {
  background-color: #da190b;
}

.error-message {
  color: var(--danger-color);
  margin: 15px 0;
  text-align: center;
}

form .btn-primary {
  width: 100%;
  margin-top: 20px;
}
</style>

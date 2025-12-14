<template>
  <div class="statistic-page">
    <div class="container">
      <header class="page-header">
        <button class="btn btn-secondary" @click="goBack">← 返回</button>
        <h1>遊戲統計</h1>
      </header>

      <!-- 第一步：選擇桌遊 -->
      <div class="card" v-if="step === 1">
        <h2>選擇桌遊</h2>
        <div class="game-list">
          <div
            v-for="game in gameList"
            :key="game"
            class="game-item"
            @click="selectGame(game)"
          >
            <span>{{ game }}</span>
            <span class="arrow">→</span>
          </div>
          <div v-if="gameList.length === 0" class="empty-message">
            暫無遊戲紀錄
          </div>
        </div>
      </div>

      <!-- 第二步：選擇查詢維度 -->
      <div class="card" v-if="step === 2">
        <h2>{{ selectedGame }} - 選擇查詢方式</h2>
        <div class="query-options">
          <button class="btn btn-primary" @click="showPlayerList">
            按玩家查詢
          </button>
          <button class="btn btn-primary" @click="showDateList">
            按日期查詢
          </button>
        </div>
      </div>

      <!-- 第三步：顯示玩家列表或日期列表 -->
      <div class="card" v-if="step === 3">
        <h2>{{ selectedGame }} - {{ queryType === 'player' ? '選擇玩家' : '選擇日期' }}</h2>
        <div class="list">
          <div
            v-for="item in queryList"
            :key="item"
            class="list-item"
            @click="selectQueryItem(item)"
          >
            <span>{{ item }}</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>

      <!-- 第四步：顯示結果 -->
      <div class="card" v-if="step === 4">
        <h2>查詢結果</h2>
        <div class="result-info">
          <p><strong>遊戲：</strong>{{ selectedGame }}</p>
          <p v-if="queryType === 'player'">
            <strong>玩家：</strong>{{ selectedQueryItem }}
          </p>
          <p v-else>
            <strong>日期：</strong>{{ selectedQueryItem }}
          </p>
        </div>

        <div class="records">
          <div
            v-for="(record, index) in records"
            :key="index"
            class="record-card"
          >
            <h3>{{ record.date }}</h3>
            <div class="players-info">
              <div
                v-for="player in record.players"
                :key="player.name"
                class="player-info"
                :class="{ highlighted: player.name === selectedQueryItem }"
              >
                <span class="player-name">{{ player.name }}</span>
                <span class="player-score">{{ player.score }} 分</span>
              </div>
            </div>
          </div>
          <div v-if="records.length === 0" class="empty-message">
            暫無記錄
          </div>
        </div>

        <button class="btn btn-secondary" @click="resetQuery">
          重新查詢
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gameAPI } from '@/api'

const router = useRouter()

const step = ref(1)
const gameList = ref([])
const selectedGame = ref('')
const queryType = ref('') // 'player' or 'date'
const queryList = ref([])
const selectedQueryItem = ref('')
const records = ref([])

onMounted(async () => {
  try {
    const response = await gameAPI.getGameList()
    gameList.value = response.games || []
  } catch (error) {
    console.error('Failed to load game list:', error)
  }
})

const selectGame = (game) => {
  selectedGame.value = game
  step.value = 2
}

const showPlayerList = async () => {
  try {
    queryType.value = 'player'
    const response = await gameAPI.getPlayerList(selectedGame.value)
    queryList.value = response.players || []
    step.value = 3
  } catch (error) {
    console.error('Failed to load player list:', error)
  }
}

const showDateList = async () => {
  try {
    queryType.value = 'date'
    const response = await gameAPI.getDateList(selectedGame.value)
    queryList.value = response.dates || []
    step.value = 3
  } catch (error) {
    console.error('Failed to load date list:', error)
  }
}

const selectQueryItem = async (item) => {
  try {
    selectedQueryItem.value = item
    let response

    if (queryType.value === 'player') {
      response = await gameAPI.getRecordsByPlayer(selectedGame.value, item)
    } else {
      response = await gameAPI.getRecordsByDate(selectedGame.value, item)
    }

    records.value = response.records || []
    step.value = 4
  } catch (error) {
    console.error('Failed to load records:', error)
  }
}

const resetQuery = () => {
  step.value = 1
  selectedGame.value = ''
  queryType.value = ''
  queryList.value = []
  selectedQueryItem.value = ''
  records.value = []
}

const goBack = () => {
  if (step.value > 1) {
    step.value--
  } else {
    router.push('/main')
  }
}
</script>

<style scoped>
.statistic-page {
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

.card h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.game-list,
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-item,
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-item:hover,
.list-item:hover {
  background: #e9e9e9;
  transform: translateX(5px);
}

.arrow {
  color: #999;
  font-size: 20px;
}

.query-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.result-info {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.result-info p {
  margin: 5px 0;
}

.records {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.record-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.record-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.players-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-info {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.player-info.highlighted {
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
}

.player-name {
  font-weight: 500;
}

.player-score {
  color: #666;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>

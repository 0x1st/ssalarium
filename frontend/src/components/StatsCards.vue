<script setup>
defineProps({
  cards: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="stats-cards" v-loading="loading">
    <div 
      v-for="(card, index) in cards" 
      :key="index"
      class="stat-card"
      :class="card.gradient"
    >
      <div class="stat-icon">{{ card.icon }}</div>
      <div class="stat-content">
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  min-height: 116px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e0dc;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  border-color: #d5d0cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.gradient-blue {
  border-left: 3px solid #da7756;
}

.gradient-green {
  border-left: 3px solid #5a8a6e;
}

.gradient-orange {
  border-left: 3px solid #da7756;
}

.gradient-purple {
  border-left: 3px solid #c4684a;
}

.stat-icon {
  font-size: 28px;
  margin-right: 16px;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 22px;
  font-weight: 500;
  color: #2d2a26;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #6b6560;
  font-weight: 450;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    font-size: 24px;
    margin-right: 12px;
  }

  .stat-value {
    font-size: 18px;
  }
}
</style>

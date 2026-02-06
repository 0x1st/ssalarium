<script setup>
import { DollarSign, TrendingUp, Award } from 'lucide-vue-next'

defineProps({
  stats: {
    type: Object,
    required: true
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount || 0)
}
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon stat-icon-primary">
        <DollarSign :size="20" />
      </div>
      <div class="stat-content">
        <span class="stat-label">累计实发工资</span>
        <span class="stat-value">{{ formatCurrency(stats.total) }}</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-success">
        <TrendingUp :size="20" />
      </div>
      <div class="stat-content">
        <span class="stat-label">平均实发工资</span>
        <span class="stat-value">{{ formatCurrency(stats.average) }}</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-warning">
        <Award :size="20" />
      </div>
      <div class="stat-content">
        <span class="stat-label">最近实发工资</span>
        <span class="stat-value">{{ formatCurrency(stats.latest) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e0dc;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #d5d0cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-primary {
  background: #da7756;
  color: white;
}

.stat-icon-success {
  background: #5a8a6e;
  color: white;
}

.stat-icon-warning {
  background: #c9a227;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b6560;
  font-weight: 450;
}

.stat-value {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 1.375rem;
  font-weight: 500;
  color: #2d2a26;
  letter-spacing: -0.01em;
}
</style>

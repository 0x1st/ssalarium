<script setup>
import { Calendar, Edit, Trash2 } from 'lucide-vue-next'

defineProps({
  salaries: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount || 0)
}

function computeCustomIncome(salary) {
  if (!salary.custom_fields) return 0
  return Object.values(salary.custom_fields).reduce((sum, val) => sum + (val > 0 ? val : 0), 0)
}
</script>

<template>
  <div class="table-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="salaries.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <h3>暂无工资记录</h3>
      <p>点击上方按钮添加第一条记录</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>时间</th>
            <th class="text-right">基本工资</th>
            <th class="text-right">绩效工资</th>
            <th class="text-right">自定义收入</th>
            <th class="text-right">总收入</th>
            <th class="text-right">五险一金</th>
            <th class="text-right">个税</th>
            <th class="text-right highlight">实际到手</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="salary in salaries" :key="salary.id">
            <td>
              <div class="date-cell">
                <Calendar :size="14" class="date-icon" />
                <span>{{ salary.year }}/{{ salary.month.toString().padStart(2, '0') }}</span>
              </div>
            </td>
            <td class="text-right">{{ formatCurrency(salary.base_salary) }}</td>
            <td class="text-right">{{ formatCurrency(salary.performance_salary) }}</td>
            <td class="text-right text-muted">{{ formatCurrency(computeCustomIncome(salary)) }}</td>
            <td class="text-right">{{ formatCurrency(salary.total_income) }}</td>
            <td class="text-right text-danger">-{{ formatCurrency(salary.total_deductions) }}</td>
            <td class="text-right text-danger">-{{ formatCurrency(salary.tax) }}</td>
            <td class="text-right highlight font-semibold text-success">{{ formatCurrency(salary.actual_take_home) }}</td>
            <td class="text-center">
              <div class="action-buttons">
                <button
                  class="action-btn action-btn-edit"
                  @click="emit('edit', salary)"
                  title="编辑"
                >
                  <Edit :size="14" />
                </button>
                <button
                  class="action-btn action-btn-delete"
                  @click="emit('delete', salary)"
                  title="删除"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #d97706;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.data-table tbody tr {
  transition: background 0.15s ease;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #9ca3af;
}

.text-danger {
  color: #dc2626;
}

.text-success {
  color: #059669;
}

.font-semibold {
  font-weight: 600;
}

.highlight {
  background: rgba(217, 119, 6, 0.04);
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-icon {
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-edit {
  background: #f0f9ff;
  color: #0284c7;
}

.action-btn-edit:hover {
  background: #e0f2fe;
}

.action-btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn-delete:hover {
  background: #fee2e2;
}
</style>

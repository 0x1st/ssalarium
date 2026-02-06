<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  yearOptions: {
    type: Array,
    required: true
  },
  modelYear: {
    type: [Number, null],
    default: null
  },
  modelMonth: {
    type: [Number, null],
    default: null
  }
})

const emit = defineEmits(['update:modelYear', 'update:modelMonth', 'clear'])

const hasFilters = computed(() => props.modelYear !== null || props.modelMonth !== null)

import { computed } from 'vue'
</script>

<template>
  <div class="filter-bar">
    <div class="filter-group">
      <label class="filter-label">年份</label>
      <select
        class="filter-select"
        :value="modelYear"
        @change="emit('update:modelYear', $event.target.value ? Number($event.target.value) : null)"
      >
        <option :value="null">全部</option>
        <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">月份</label>
      <select
        class="filter-select"
        :value="modelMonth"
        @change="emit('update:modelMonth', $event.target.value ? Number($event.target.value) : null)"
      >
        <option :value="null">全部</option>
        <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
      </select>
    </div>
    <button
      v-if="hasFilters"
      class="btn-clear"
      @click="emit('clear')"
    >
      <X :size="14" />
      清除筛选
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.filter-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  min-width: 100px;
}

.filter-select:hover {
  border-color: #d1d5db;
}

.filter-select:focus {
  outline: none;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #f3f4f6;
  color: #374151;
}
</style>

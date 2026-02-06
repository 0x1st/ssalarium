<script setup>
import { ref, computed, watch } from 'vue'
import { Calendar, DollarSign, Shield, Calculator, FileText, Settings } from 'lucide-vue-next'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  },
  customFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'submit', 'manage-fields'])

const form = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  base_salary: 0,
  performance_salary: 0,
  pension_insurance: 0,
  medical_insurance: 0,
  unemployment_insurance: 0,
  critical_illness_insurance: 0,
  enterprise_annuity: 0,
  housing_fund: 0,
  tax: 0,
  note: ''
})

const customFieldValues = ref({})

const incomeCustomFields = computed(() => props.customFields.filter(f => f.field_type === 'income'))
const deductionCustomFields = computed(() => props.customFields.filter(f => f.field_type === 'deduction'))

watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.initialData) {
      form.value = {
        year: props.initialData.year,
        month: props.initialData.month,
        base_salary: props.initialData.base_salary || 0,
        performance_salary: props.initialData.performance_salary || 0,
        pension_insurance: props.initialData.pension_insurance || 0,
        medical_insurance: props.initialData.medical_insurance || 0,
        unemployment_insurance: props.initialData.unemployment_insurance || 0,
        critical_illness_insurance: props.initialData.critical_illness_insurance || 0,
        enterprise_annuity: props.initialData.enterprise_annuity || 0,
        housing_fund: props.initialData.housing_fund || 0,
        tax: props.initialData.tax || 0,
        note: props.initialData.note || ''
      }
      customFieldValues.value = {}
      props.customFields.forEach(f => {
        customFieldValues.value[f.field_key] = props.initialData.custom_fields?.[f.field_key] || 0
      })
    } else {
      form.value = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        base_salary: 0,
        performance_salary: 0,
        pension_insurance: 0,
        medical_insurance: 0,
        unemployment_insurance: 0,
        critical_illness_insurance: 0,
        enterprise_annuity: 0,
        housing_fund: 0,
        tax: 0,
        note: ''
      }
      customFieldValues.value = {}
      props.customFields.forEach(f => {
        customFieldValues.value[f.field_key] = 0
      })
    }
  }
})

function handleSubmit() {
  const customFieldsPayload = {}
  for (const key in customFieldValues.value) {
    const val = customFieldValues.value[key]
    if (typeof val === 'number' && isFinite(val) && val !== 0) {
      customFieldsPayload[key] = val
    }
  }

  emit('submit', {
    ...form.value,
    custom_fields: Object.keys(customFieldsPayload).length > 0 ? customFieldsPayload : null
  })
}

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ isEditing ? '编辑工资记录' : '添加工资记录' }}</h2>
            <button class="close-btn" @click="close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <!-- 基本信息 -->
            <div class="form-section">
              <div class="section-header">
                <Calendar :size="18" class="section-icon" />
                <h3>基本信息</h3>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>年份</label>
                  <input v-model.number="form.year" type="number" min="2000" max="2100" />
                </div>
                <div class="form-group">
                  <label>月份</label>
                  <input v-model.number="form.month" type="number" min="1" max="12" />
                </div>
              </div>
            </div>

            <!-- 收入明细 -->
            <div class="form-section">
              <div class="section-header">
                <DollarSign :size="18" class="section-icon" />
                <h3>收入明细</h3>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>基本工资</label>
                  <input v-model.number="form.base_salary" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>绩效工资</label>
                  <input v-model.number="form.performance_salary" type="number" step="0.01" min="0" />
                </div>
              </div>

              <!-- 自定义收入字段 -->
              <div v-if="incomeCustomFields.length > 0" class="custom-fields">
                <div class="custom-fields-header">
                  <span>自定义收入</span>
                  <button type="button" class="link-btn" @click="emit('manage-fields')">
                    <Settings :size="12" />
                    管理
                  </button>
                </div>
                <div class="form-grid">
                  <div class="form-group" v-for="field in incomeCustomFields" :key="field.id">
                    <label>{{ field.name }}</label>
                    <input v-model.number="customFieldValues[field.field_key]" type="number" step="0.01" min="0" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 扣除明细 -->
            <div class="form-section">
              <div class="section-header">
                <Shield :size="18" class="section-icon" />
                <h3>五险一金</h3>
              </div>
              <div class="form-grid form-grid-3">
                <div class="form-group">
                  <label>养老保险</label>
                  <input v-model.number="form.pension_insurance" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>医疗保险</label>
                  <input v-model.number="form.medical_insurance" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>失业保险</label>
                  <input v-model.number="form.unemployment_insurance" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>大病保险</label>
                  <input v-model.number="form.critical_illness_insurance" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>企业年金</label>
                  <input v-model.number="form.enterprise_annuity" type="number" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>住房公积金</label>
                  <input v-model.number="form.housing_fund" type="number" step="0.01" min="0" />
                </div>
              </div>

              <!-- 自定义扣款字段 -->
              <div v-if="deductionCustomFields.length > 0" class="custom-fields">
                <div class="custom-fields-header">
                  <span>自定义扣款</span>
                  <button type="button" class="link-btn" @click="emit('manage-fields')">
                    <Settings :size="12" />
                    管理
                  </button>
                </div>
                <div class="form-grid">
                  <div class="form-group" v-for="field in deductionCustomFields" :key="field.id">
                    <label>{{ field.name }}</label>
                    <input v-model.number="customFieldValues[field.field_key]" type="number" step="0.01" min="0" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 税费 -->
            <div class="form-section">
              <div class="section-header">
                <Calculator :size="18" class="section-icon" />
                <h3>税费</h3>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>个人所得税</label>
                  <input v-model.number="form.tax" type="number" step="0.01" min="0" />
                </div>
              </div>
            </div>

            <!-- 备注 -->
            <div class="form-section">
              <div class="section-header">
                <FileText :size="18" class="section-icon" />
                <h3>备注</h3>
              </div>
              <div class="form-group">
                <textarea
                  v-model="form.note"
                  placeholder="添加备注信息（可选）"
                  rows="2"
                  maxlength="200"
                ></textarea>
              </div>
            </div>
          </form>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">取消</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">保存</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.section-icon {
  color: #d97706;
}

.section-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
}

.form-group input,
.form-group textarea {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.form-group input:hover,
.form-group textarea:hover {
  border-color: #d1d5db;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d97706;
  background: white;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.custom-fields {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px dashed #e5e7eb;
}

.custom-fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #d97706;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
}

.link-btn:hover {
  text-decoration: underline;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #d97706;
  border: 1px solid #d97706;
  color: white;
}

.btn-primary:hover {
  background: #b45309;
  border-color: #b45309;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

@media (max-width: 640px) {
  .form-grid,
  .form-grid-3 {
    grid-template-columns: 1fr;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>

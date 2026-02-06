<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../utils/axios'
import { useUserStore } from '../store/user'
import { useStatsStore } from '../store/stats'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Users, DollarSign, Trash2, Edit, User, TrendingUp, Calendar, Award } from 'lucide-vue-next'
import PageContainer from '../components/PageContainer.vue'
import PageHeader from '../components/PageHeader.vue'
import StatsCards from '../components/StatsCards.vue'


const user = useUserStore()
const statsStore = useStatsStore()
const list = ref([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const form = ref({ 
  name: '', 
  note: '',
  pension_history: 0,
  medical_history: 0,
  housing_fund_history: 0
})
const loading = ref(false)

// Dialog title
const dialogTitle = computed(() => (isEditing.value ? '编辑人员' : '添加人员'))

// Computed properties for statistics
const currentMonth = computed(() => {
  const month = new Date().getMonth() + 1
  return `${month}月`
})

const completeProfileRate = computed(() => {
  if (list.value.length === 0) return '0%'
  const completeProfiles = list.value.filter(person => person.note && person.note.trim()).length
  const rate = Math.round((completeProfiles / list.value.length) * 100)
  return `${rate}%`
})

// Stats cards configuration
const statsCardsData = computed(() => [
  { icon: '📅', value: new Date().getFullYear().toString(), label: '当前年份', gradient: 'gradient-orange' },
  { icon: '📅', value: currentMonth.value, label: '当前月份', gradient: 'gradient-orange' },
  { icon: '👥', value: list.value.length.toString(), label: '总用户', gradient: 'gradient-blue' },
  { icon: '✅', value: list.value.length > 0 ? '100%' : '0%', label: '活跃率', gradient: 'gradient-green' }
])

// Load persons data
async function load() {
  loading.value = true
  try {
    const { data } = await api.get('/persons/')
    list.value = data
  } catch (error) {
    ElMessage.error('加载人员数据失败')
  } finally {
    loading.value = false
  }
}

// Open create person dialog
function openCreate() {
  isEditing.value = false
  editingId.value = null
  form.value = { 
    name: '', 
    note: '',
    pension_history: 0,
    medical_history: 0,
    housing_fund_history: 0
  }
  dialogVisible.value = true
}

// Open edit dialog
function openEdit(person) {
  isEditing.value = true
  editingId.value = person.id
  form.value = {
    name: person.name || '',
    note: person.note || '',
    pension_history: Number(person.pension_history || 0),
    medical_history: Number(person.medical_history || 0),
    housing_fund_history: Number(person.housing_fund_history || 0),
  }
  dialogVisible.value = true
}

// Submit create/update person
async function submit() {
  const name = (form.value.name || '').trim()
  if (!name) {
    ElMessage.warning('请输入姓名')
    return
  }
  if (name.length > 64) {
    ElMessage.warning('姓名长度不能超过64个字符')
    return
  }
  if (form.value.note && form.value.note.length > 255) {
    ElMessage.warning('备注长度不能超过255个字符')
    return
  }

  try {
    if (isEditing.value) {
      const { data } = await api.put(`/persons/${editingId.value}`, form.value)
      const idx = list.value.findIndex(i => i.id === editingId.value)
      if (idx !== -1) list.value[idx] = data
      dialogVisible.value = false
      isEditing.value = false
      editingId.value = null
      await load()
      ElMessage.success('更新人员成功')
    } else {
      const { data } = await api.post('/persons/', form.value)
      list.value.push(data)
      dialogVisible.value = false
      await load()
      ElMessage.success('添加人员成功')
    }
    statsStore.invalidate()
  } catch (error) {
    const detail = error?.response?.data?.detail
    let msg = isEditing.value ? '更新人员失败' : '添加人员失败'
    if (typeof detail === 'string') msg = detail
    else if (Array.isArray(detail) && detail.length) msg = detail[0]?.msg || msg
    ElMessage.error(msg)
  }
}

// Remove person
async function remove(id, name) {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${name} 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await api.delete(`/persons/${id}`)
    list.value = list.value.filter(i => i.id !== id)
    ElMessage.success('删除人员成功')
    statsStore.invalidate()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除人员失败')
    }
  }
}

onMounted(load)
</script>

<template>
  <PageContainer>
    <!-- Header Section -->
    <PageHeader title="信息管理" subtitle="管理用户信息">
      <template #controls>
        <el-button type="primary" @click="openCreate" class="add-button">
          <Plus class="button-icon" />
          添加用户
        </el-button>
      </template>
    </PageHeader>

    <!-- Statistics Cards -->
    <StatsCards :cards="statsCardsData" :loading="loading" />

    <!-- Persons List Section -->
    <el-card class="persons-list-card" shadow="hover" v-if="list.length > 0">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户信息</span>
          <el-button @click="load" size="small" type="primary" plain class="refresh-button">
            刷新
          </el-button>
        </div>
      </template>
      
      <div class="persons-grid">
        <div 
          v-for="person in list" 
          :key="person.id" 
          class="person-card"
        >
          <div class="person-avatar">
            <div class="avatar-icon">👤</div>
          </div>
          <div class="person-info">
            <h3 class="person-name">{{ person.name }}</h3>
            <p class="person-note" v-if="person.note">{{ person.note }}</p>
            <p class="person-note" v-else>暂无备注</p>
          </div>
          <div class="person-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="$router.push(`/salaries/${person.id}`)"
              :icon="DollarSign"
            >
              工资管理
            </el-button>
            <el-button 
              type="default" 
              size="small" 
              @click="openEdit(person)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="remove(person.id, person.name)"
              :icon="Trash2"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Empty State -->
    <el-card class="empty-state-card" shadow="hover" v-if="list.length === 0 && !loading">
      <div class="empty-container">
        <div class="empty-icon">👥</div>
        <h3 class="empty-title">暂无用户信息</h3>
        <p class="empty-description">
          还没有添加任何用户，点击下面的按钮开始添加
        </p>
        <el-button type="primary" size="large" @click="openCreate" class="empty-action">
          <Plus class="button-icon" />
          添加第一位用户
        </el-button>
      </div>
    </el-card>

    <!-- Add/Edit Person Dialog -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="500px"
      class="person-dialog"
    >
      <el-form :model="form" label-width="140px">
        <el-form-item label="姓名" required>
          <el-input 
            v-model="form.name" 
            placeholder="请输入姓名"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            v-model="form.note" 
            type="textarea" 
            placeholder="请输入备注"
            :rows="3"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
        <el-divider content-position="left">历史累计值（加入系统前）</el-divider>
        <el-form-item label="养老保险历史累计">
          <el-input-number 
            v-model="form.pension_history" 
            :min="0"
            :precision="2"
            :step="100"
            placeholder="输入加入系统前的累计金额"
            style="width: 100%"
          />
          <span style="color: #909399; font-size: 12px; margin-left: 8px;">元</span>
        </el-form-item>
        <el-form-item label="医疗保险历史累计">
          <el-input-number 
            v-model="form.medical_history" 
            :min="0"
            :precision="2"
            :step="100"
            placeholder="输入加入系统前的累计金额"
            style="width: 100%"
          />
          <span style="color: #909399; font-size: 12px; margin-left: 8px;">元</span>
        </el-form-item>
        <el-form-item label="住房公积金历史累计">
          <el-input-number 
            v-model="form.housing_fund_history" 
            :min="0"
            :precision="2"
            :step="100"
            placeholder="输入加入系统前的累计金额"
            style="width: 100%"
          />
          <span style="color: #909399; font-size: 12px; margin-left: 8px;">元</span>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<style scoped>

.add-button {
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-button:hover {
  box-shadow: 0 2px 8px rgba(218, 119, 86, 0.2);
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.persons-list-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e0dc;
  box-shadow: none;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.persons-list-card:hover {
  border-color: #d5d0cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}


/* 移除卡片标题下方的分割线 */
.persons-list-card :deep(.el-card__header) {
  border-bottom: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.card-title {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 18px;
  font-weight: 500;
  color: #2d2a26;
}

/* 统一刷新按钮样式 */
.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.persons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.person-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.2s ease;
  border: 1px solid #e5e0dc;
  position: relative;
  overflow: hidden;
}

.person-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
  background: #da7756;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.person-card:hover {
  border-color: #d5d0cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.person-card:hover::before {
  opacity: 1;
}

.person-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #da7756;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.person-avatar:hover {
  transform: rotate(0deg);
}

.person-avatar:focus {
  outline: none;
}

.person-avatar .avatar-icon {
  width: 28px;
  height: 28px;
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 17px;
  font-weight: 500;
  color: #2d2a26;
  margin: 0 0 6px 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
  transition: color 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.person-card:hover .person-name {
  color: #da7756;
}

.person-note {
  font-size: 14px;
  color: #6b6560;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.person-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.person-card:hover .person-actions {
  opacity: 1;
}

.person-actions .el-button {
  border-radius: 8px !important;
  font-weight: 450 !important;
  font-size: 13px !important;
  padding: 0 !important;
  margin: 0 !important;
  transition: all 0.2s ease !important;
  border: none !important;
  box-shadow: none !important;
  width: 110px !important;
  height: 36px !important;
  min-width: 110px !important;
  max-width: 110px !important;
  min-height: 36px !important;
  max-height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  line-height: 1 !important;
  text-align: center !important;
}

.person-actions .el-button span {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  font-size: 13px !important;
  font-weight: 450 !important;
}

.person-actions .el-button--primary {
  background: #da7756;
  color: white;
}

.person-actions .el-button--primary:hover {
  background: #c4684a;
  box-shadow: 0 2px 6px rgba(218, 119, 86, 0.25) !important;
}

.person-actions .el-button--danger {
  background: #c45c5c;
  color: white;
}

.person-actions .el-button--danger:hover {
  background: #b04f4f;
  box-shadow: 0 2px 6px rgba(196, 92, 92, 0.25) !important;
}

.person-actions .el-button .el-icon {
  margin-right: 4px;
}

.empty-state-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e0dc;
  box-shadow: none;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.empty-state-card:hover {
  border-color: #d5d0cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-container {
  padding: 3rem;
  text-align: center;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-title {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 1.375rem;
  font-weight: 500;
  color: #2d2a26;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #6b6560;
  margin-bottom: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .persons-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .person-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .person-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .person-info {
    text-align: center;
  }
}

/* Dialog styles - Claude/Anthropic style */
.person-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.person-dialog :deep(.el-dialog__header) {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e0dc;
  margin-right: 0;
}

.person-dialog :deep(.el-dialog__title) {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: #2d2a26;
}

.person-dialog :deep(.el-dialog__headerbtn) {
  top: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.person-dialog :deep(.el-dialog__headerbtn:hover) {
  background: #f5f3f1;
}

.person-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #6b6560;
}

.person-dialog :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #2d2a26;
}

.person-dialog :deep(.el-dialog__body) {
  padding: 1.5rem 2rem;
}

.person-dialog :deep(.el-dialog__footer) {
  padding: 1.25rem 2rem;
  border-top: 1px solid #e5e0dc;
}

.person-dialog :deep(.el-form-item__label) {
  font-size: 0.8125rem;
  font-weight: 450;
  color: #6b6560;
}

.person-dialog :deep(.el-input__wrapper),
.person-dialog :deep(.el-textarea__inner),
.person-dialog :deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
  background: #fdfcfb;
  box-shadow: none;
  border: 1px solid #e5e0dc;
  transition: all 0.2s ease;
}

.person-dialog :deep(.el-input__wrapper:hover),
.person-dialog :deep(.el-textarea__inner:hover),
.person-dialog :deep(.el-input-number .el-input__wrapper:hover) {
  border-color: #d5d0cc;
}

.person-dialog :deep(.el-input__wrapper.is-focus),
.person-dialog :deep(.el-textarea__inner:focus),
.person-dialog :deep(.el-input-number.is-focus .el-input__wrapper) {
  border-color: #da7756;
  background: white;
  box-shadow: 0 0 0 2px rgba(218, 119, 86, 0.1);
}

.person-dialog :deep(.el-divider__text) {
  font-size: 0.8125rem;
  color: #9a9590;
  background: white;
}

.person-dialog :deep(.el-divider) {
  border-color: #e5e0dc;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dialog-footer .el-button {
  border-radius: 8px;
  font-weight: 450;
  padding: 0.625rem 1.25rem;
}

.dialog-footer .el-button--default {
  background: #f5f3f1;
  border-color: #e5e0dc;
  color: #2d2a26;
}

.dialog-footer .el-button--default:hover {
  background: #ebe8e5;
  border-color: #d5d0cc;
  color: #2d2a26;
}

.dialog-footer .el-button--primary {
  background: #da7756;
  border-color: #da7756;
}

.dialog-footer .el-button--primary:hover {
  background: #c4684a;
  border-color: #c4684a;
}
</style>

<script setup>
import { ref } from 'vue'
import api from '../utils/axios'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from 'lucide-vue-next'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const isRegisterMode = ref(false)

const router = useRouter()
const route = useRoute()
const user = useUserStore()

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}

function validateForm() {
  if (!username.value.trim()) {
    ElMessage.warning('请输入用户名')
    return false
  }
  if (!password.value) {
    ElMessage.warning('请输入密码')
    return false
  }
  if (isRegisterMode.value && password.value !== confirmPassword.value) {
    ElMessage.warning('密码不匹配')
    return false
  }
  return true
}

async function handleLogin() {
  try {
    const { data } = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })
    user.setToken(data.access_token)
    user.setUsername(username.value)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect
    if (redirect && redirect !== '/login') {
      router.replace(redirect)
    } else {
      router.replace('/stats')
    }
  } catch {
    ElMessage.error('登录失败，请检查用户名和密码')
  }
}

async function handleRegister() {
  try {
    await api.post('/auth/register', {
      username: username.value,
      password: password.value
    })
    ElMessage.success('注册成功')
    await handleLogin()
  } catch {
    ElMessage.error('注册失败')
  }
}

async function onSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    if (isRegisterMode.value) {
      await handleRegister()
    } else {
      await handleLogin()
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 class="brand">Salarium</h1>
          <p class="tagline">简洁高效的工资管理</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="login-form">
          <div class="form-group">
            <label class="form-label">
              <User :size="14" />
              用户名
            </label>
            <input
              v-model="username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              :disabled="loading"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Lock :size="14" />
              密码
            </label>
            <input
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>

          <div v-if="isRegisterMode" class="form-group">
            <label class="form-label">
              <Lock :size="14" />
              确认密码
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入密码"
              :disabled="loading"
              autocomplete="new-password"
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '处理中...' : (isRegisterMode ? '注册' : '登录') }}
          </button>

          <div class="toggle-section">
            <span class="toggle-text">
              {{ isRegisterMode ? '已有账户？' : '还没有账户？' }}
            </span>
            <button type="button" class="toggle-btn" @click="toggleMode" :disabled="loading">
              {{ isRegisterMode ? '登录' : '注册' }}
            </button>
          </div>
        </form>
      </div>

      <p class="footer-text">安全 · 简洁 · 高效</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fdfcfb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid #e5e0dc;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 56px;
  height: 56px;
  background: #da7756;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
}

.brand {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 1.625rem;
  font-weight: 500;
  color: #2d2a26;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.tagline {
  font-size: 0.875rem;
  color: #6b6560;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 450;
  color: #2d2a26;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 1px solid #e5e0dc;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #fdfcfb;
  transition: all 0.2s ease;
}

.form-input:hover {
  border-color: #d5d0cc;
}

.form-input:focus {
  outline: none;
  border-color: #da7756;
  background: white;
  box-shadow: 0 0 0 2px rgba(218, 119, 86, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #da7756;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #c4684a;
}

.submit-btn:active:not(:disabled) {
  background: #b85d42;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toggle-section {
  text-align: center;
  margin-top: 0.5rem;
}

.toggle-text {
  font-size: 0.875rem;
  color: #6b6560;
}

.toggle-btn {
  background: none;
  border: none;
  color: #da7756;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.toggle-btn:hover:not(:disabled) {
  color: #c4684a;
  text-decoration: underline;
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-text {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: #9a9590;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
}
</style>

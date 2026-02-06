<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="page-header">
    <div class="header-left">
      <h2 class="page-title">{{ title }}</h2>
      <p class="page-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-controls">
      <slot name="controls" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
  padding: 0 4px;
  min-height: 68px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 26px;
  font-weight: 500;
  color: #da7756;
  margin: 0 0 6px 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 15px;
  color: #6b6560;
  margin: 0;
  line-height: 1.5;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-height: auto;
  }

  .page-title {
    font-size: 22px;
  }

  .page-subtitle {
    font-size: 14px;
  }
}
</style>

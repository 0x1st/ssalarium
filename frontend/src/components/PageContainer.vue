<script setup>
defineProps({
  minHeight: {
    type: String,
    default: 'calc(80vh - 180px)'
  }
})
</script>

<template>
  <div class="page-container" :style="{ minHeight }">
    <slot />
  </div>
</template>

<style scoped>
.page-container {
  padding: 32px;
  background: #fdfcfb;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 16px;
  }
}
</style>

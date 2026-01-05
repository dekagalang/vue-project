<template>
  <v-card class="stat-card">
    <v-card-text>
      <div class="text-subtitle-2 text-disabled mb-2">{{ title }}</div>
      <div class="text-h4 font-weight-bold">{{ value }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    value: string | number
  }>()
</script>

<style scoped>
  .stat-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
</style>

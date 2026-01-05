<template>
  <v-card>
    <v-card-title>Products per Category</v-card-title>
    <v-card-text>
      <div
        v-if="isPending"
        class="text-center pa-8"
      >
        <v-progress-circular indeterminate />
      </div>
      <BarChart
        v-else
        :chart-data="chartData"
        :options="options"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { ChartOptions } from 'chart.js'

  defineProps<{
    chartData: any
    options: ChartOptions<any>
    isPending: boolean
  }>()
</script>

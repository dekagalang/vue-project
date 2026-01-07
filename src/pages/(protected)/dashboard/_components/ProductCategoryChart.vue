<template>
  <v-card>
    <v-card-title class="text-subtitle1">Products per Category</v-card-title>
    <v-card-text>
      <div
        v-if="isPending"
        class="text-center pa-8"
      >
        <v-progress-circular indeterminate />
      </div>
      <div
        v-else
        style="position: relative; height: 250px"
      >
        <Bar
          :data="chartData"
          :options="options"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { ChartOptions } from 'chart.js'
  import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
  } from 'chart.js'
  import { Bar } from 'vue-chartjs'

  ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

  interface ChartDataset {
    label?: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }

  interface ChartDataType {
    labels: (string | undefined)[]
    datasets: ChartDataset[]
  }

  defineProps<{
    chartData: ChartDataType
    options: ChartOptions<'bar'>
    isPending: boolean
  }>()
</script>

<style scoped>
  :deep(.v-card-title) {
    padding: 16px 16px 8px 16px;
  }

  :deep(.v-card-text) {
    padding: 8px 16px 16px 16px;
  }
</style>

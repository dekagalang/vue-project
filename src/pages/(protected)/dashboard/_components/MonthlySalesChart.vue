<template>
  <v-card>
    <v-card-title class="text-subtitle1">Monthly Sales Trend</v-card-title>
    <v-card-text>
      <div style="position: relative; height: 250px">
        <Line
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
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
  } from 'chart.js'
  import { Line } from 'vue-chartjs'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  )

  interface ChartDataset {
    label?: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    tension?: number
    fill?: boolean
  }

  interface ChartDataType {
    labels: (string | undefined)[]
    datasets: ChartDataset[]
  }

  defineProps<{
    chartData: ChartDataType
    options: ChartOptions<'line'>
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

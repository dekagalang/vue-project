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

  defineProps<{
    chartData: any
    options: ChartOptions<any>
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

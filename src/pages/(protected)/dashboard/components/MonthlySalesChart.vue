<template>
  <v-card>
    <v-card-title>Monthly Sales Trend (Dummy Data)</v-card-title>
    <v-card-text>
      <LineChart
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
  }>()
</script>

<template>
  <div class="dashboard-page">
    <v-container fluid>
      <v-row class="mb-6">
        <v-col cols="12">
          <h1 class="text-h4">Dashboard</h1>
        </v-col>
      </v-row>

      <!-- KPI Cards -->
      <v-row class="mb-6">
        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <StatCard
            title="Total Users"
            :value="data.totalUsers.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <StatCard
            title="Total Products"
            :value="data.totalProducts.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <StatCard
            title="Total Categories"
            :value="data.totalCategories.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <StatCard
            title="Total Stock Value"
            :value="`Rp ${data.totalStockValue.value.toLocaleString('id-ID')}`"
          />
        </v-col>
      </v-row>

      <!-- Charts Row 1 -->
      <v-row class="mb-6">
        <v-col
          cols="12"
          md="4"
        >
          <UserRoleChart
            :chart-data="data.userRoleChartData.value"
            :options="data.chartOptions"
            :is-pending="data.usersIsPending.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <ProductCategoryChart
            :chart-data="data.productCategoryChartData.value"
            :options="data.chartOptions"
            :is-pending="data.productsIsPending.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <MonthlySalesChart
            :chart-data="data.monthlySalesChartData.value"
            :options="data.chartOptions"
          />
        </v-col>
      </v-row>

      <!-- Charts Row 2 -->
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <RecentUsersList
            :users="data.recentUsers.value"
            :is-pending="data.usersIsPending.value"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <LowStockProductsList
            :products="data.lowStockProducts.value"
            :is-pending="data.productsIsPending.value"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js'
  import LowStockProductsList from './_components/LowStockProductsList.vue'
  import MonthlySalesChart from './_components/MonthlySalesChart.vue'
  import ProductCategoryChart from './_components/ProductCategoryChart.vue'
  import RecentUsersList from './_components/RecentUsersList.vue'
  import StatCard from './_components/StatCard.vue'
  import UserRoleChart from './_components/UserRoleChart.vue'
  import { useDashboardData } from './_hooks/useDashboardData'

  definePage({
    path: '/dashboard',
    meta: {
      requiresAuth: true,
    },
  })

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  )

  const data = useDashboardData()
</script>

<style scoped>
  .dashboard-page {
    padding-top: 20px;
  }
</style>

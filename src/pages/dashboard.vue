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
          <v-card class="stat-card">
            <v-card-text>
              <div class="text-subtitle-2 text-disabled mb-2">Total Users</div>
              <div class="text-h4 font-weight-bold">{{ totalUsers }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <v-card class="stat-card">
            <v-card-text>
              <div class="text-subtitle-2 text-disabled mb-2">
                Total Products
              </div>
              <div class="text-h4 font-weight-bold">{{ totalProducts }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <v-card class="stat-card">
            <v-card-text>
              <div class="text-subtitle-2 text-disabled mb-2">
                Total Categories
              </div>
              <div class="text-h4 font-weight-bold">{{ totalCategories }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="3"
          sm="6"
        >
          <v-card class="stat-card">
            <v-card-text>
              <div class="text-subtitle-2 text-disabled mb-2">
                Total Stock Value
              </div>
              <div class="text-h6 font-weight-bold">
                Rp {{ totalStockValue.toLocaleString('id-ID') }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts -->
      <v-row class="mb-6">
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Users by Role</v-card-title>
            <v-card-text>
              <div
                v-if="usersQuery.isPending"
                class="text-center pa-8"
              >
                <v-progress-circular indeterminate />
              </div>
              <DoughnutChart
                v-else
                :chart-data="userRoleChartData"
                :options="chartOptions"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Products per Category</v-card-title>
            <v-card-text>
              <div
                v-if="productsQuery.isPending"
                class="text-center pa-8"
              >
                <v-progress-circular indeterminate />
              </div>
              <BarChart
                v-else
                :chart-data="productCategoryChartData"
                :options="chartOptions"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Monthly Sales Chart -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card>
            <v-card-title>Monthly Sales Trend (Dummy Data)</v-card-title>
            <v-card-text>
              <LineChart
                :chart-data="monthlySalesChartData"
                :options="chartOptions"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Activity -->
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Recent Users</v-card-title>
            <v-list v-if="!usersQuery.isPending">
              <v-list-item
                v-for="user in recentUsers"
                :key="user.id"
                :subtitle="user.email"
                :title="user.name"
              >
                <template #prepend>
                  <v-avatar color="primary">
                    {{ user.name.charAt(0) }}
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
            <div
              v-else
              class="pa-8 text-center"
            >
              <v-progress-circular indeterminate />
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Low Stock Products</v-card-title>
            <v-list v-if="!productsQuery.isPending">
              <v-list-item
                v-for="product in lowStockProducts"
                :key="product.id"
                :title="product.name"
              >
                <template #subtitle>
                  <v-chip
                    color="error"
                    size="x-small"
                    text-color="white"
                  >
                    Stock: {{ product.stock }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <div
              v-else
              class="pa-8 text-center"
            >
              <v-progress-circular indeterminate />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ChartOptions } from 'chart.js'
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
  import { computed, unref } from 'vue'
  import { Chart as _ChartComponent } from 'vue-chartjs'
  import { useCategories, useProducts, useUsers } from '@/composables/useApi'

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

  const usersQuery = useUsers()
  const productsQuery = useProducts()
  const categoriesQuery = useCategories()

  const chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  // KPI Calculations
  const totalUsers = computed(() => {
    const data = unref(usersQuery.data)
    return data ? data.length : 0
  })
  const totalProducts = computed(() => {
    const data = unref(productsQuery.data)
    return data ? data.length : 0
  })
  const totalCategories = computed(() => {
    const data = unref(categoriesQuery.data)
    return data ? data.length : 0
  })

  const totalStockValue = computed(() => {
    const data = unref(productsQuery.data)
    if (!data) return 0
    return data.reduce((sum: number, product) => {
      return sum + product.price * product.stock
    }, 0)
  })

  // User Role Chart Data
  const userRoleChartData = computed(() => {
    const roles = { admin: 0, manager: 0, user: 0 }
    const users = unref(usersQuery.data) || []
    for (const user of users) {
      roles[user.role]++
    }

    return {
      labels: ['Admin', 'Manager', 'User'],
      datasets: [
        {
          data: [roles.admin, roles.manager, roles.user],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(33, 150, 243, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(33, 150, 243, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  })

  // Product Category Chart Data
  const productCategoryChartData = computed(() => {
    const categoryCount: Record<string, number> = {}
    const categoryNames: Record<string, string> = {}
    const categories = unref(categoriesQuery.data) || []
    const products = unref(productsQuery.data) || []

    for (const cat of categories) {
      categoryCount[cat.id] = 0
      categoryNames[cat.id] = cat.name
    }

    for (const product of products) {
      const catId = product.categoryId
      if (catId && categoryCount[catId] !== undefined) {
        categoryCount[catId]++
      }
    }

    const labels = Object.entries(categoryCount).map(
      ([id]) => categoryNames[id],
    )
    const data = Object.values(categoryCount)

    return {
      labels,
      datasets: [
        {
          label: 'Number of Products',
          data,
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
      ],
    }
  })

  // Monthly Sales Chart Data (Dummy)
  const monthlySalesChartData = computed(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const sales = [65, 59, 80, 81, 56, 55, 70, 65, 75, 80, 85, 90]

    return {
      labels: months,
      datasets: [
        {
          label: 'Sales (Rp Juta)',
          data: sales,
          borderColor: 'rgba(156, 39, 176, 1)',
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }
  })

  // Recent Users (latest 3)
  const recentUsers = computed(() => {
    const users = unref(usersQuery.data) || []
    return users.slice(0, 3)
  })

  // Low Stock Products (stock < 50)
  const lowStockProducts = computed(() => {
    const products = unref(productsQuery.data) || []
    const filtered = products.filter(p => p.stock < 50)
    // eslint-disable-next-line unicorn/no-array-sort
    return filtered.sort((a: any, b: any) => a.stock - b.stock).slice(0, 5)
  })
</script>

<style scoped>
  .dashboard-page {
    padding-top: 20px;
  }

  .stat-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
</style>

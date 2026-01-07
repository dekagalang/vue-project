import type { ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { useCategories, useProducts, useUsers } from '@/composables'

export function useDashboardData() {
  const { data: usersData, isPending: usersIsPending } = useUsers()
  const { data: productsData, isPending: productsIsPending } = useProducts()
  const { data: categoriesData } = useCategories()

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
  const totalUsers = computed(() => usersData.value?.length ?? 0)
  const totalProducts = computed(() => productsData.value?.length ?? 0)
  const totalCategories = computed(() => categoriesData.value?.length ?? 0)

  const totalStockValue = computed(() => {
    if (!productsData.value) return 0
    return productsData.value.reduce((sum: number, product) => {
      return sum + product.price * product.stock
    }, 0)
  })

  // User Role Chart Data
  const userRoleChartData = computed(() => {
    const roles = { admin: 0, manager: 0, user: 0 }
    const users = usersData.value || []
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
    const categories = categoriesData.value || []
    const products = productsData.value || []

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
  const recentUsers = computed(() => usersData.value?.slice(0, 3) ?? [])

  // Low Stock Products (stock < 50)
  const lowStockProducts = computed(() => {
    const products = productsData.value || []
    const filtered = products.filter(p => p.stock < 50)
    return filtered.sort((a: any, b: any) => a.stock - b.stock).slice(0, 5)
  })

  return {
    usersData,
    usersIsPending,
    productsData,
    productsIsPending,
    categoriesData,
    chartOptions,
    totalUsers,
    totalProducts,
    totalCategories,
    totalStockValue,
    userRoleChartData,
    productCategoryChartData,
    monthlySalesChartData,
    recentUsers,
    lowStockProducts,
  }
}

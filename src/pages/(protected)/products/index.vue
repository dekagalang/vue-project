<template>
  <div class="products-page">
    <v-container fluid>
      <v-row
        align="center"
        class="mb-6"
      >
        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-h4">Product Management</h1>
        </v-col>
        <v-col
          class="text-right"
          cols="12"
          md="6"
        >
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            :to="{ path: '/products/create' }"
          >
            Add Product
          </v-btn>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row
        v-if="isPending"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="table" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Products"
            type="error"
          >
            {{ error?.message || 'Failed to load products' }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data Table -->
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <ProductTable
              :products="mockProducts"
              @edit="openEditDialog"
              @delete="confirmDelete"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="handleDelete"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  import type { ProductData } from '@/api/mock'
  import { useCategories, useDeleteProduct, useProducts } from '@/composables'
  import DeleteConfirmDialog from './_components/DeleteConfirmDialog.vue'
  import ProductTable from './_components/ProductTable.vue'

  const router = useRouter()

  definePage({
    path: '/products',
    meta: {
      requiresAuth: true,
    },
  })

  // Get products from composables
  const { data: productsData, isPending, isError, error } = useProducts()
  const { data: categoriesData } = useCategories()
  const deleteProduct = useDeleteProduct()

  // Local ref for mutations
  const mutatedProducts = ref<ProductData[] | null>(null)

  // mockProducts reactively shows composables data or local mutations
  const mockProducts = computed(
    () => mutatedProducts.value || productsData.value || [],
  )

  const deleteDialogOpen = ref(false)
  const deleteProductId = ref<string | null>(null)

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function openEditDialog(product: ProductData) {
    router.push(`/products/${product.id}/edit`)
  }

  function confirmDelete(id: string) {
    deleteProductId.value = id
    deleteDialogOpen.value = true
  }

  async function handleDelete() {
    if (!deleteProductId.value) return

    try {
      await deleteProduct.mutateAsync(deleteProductId.value)
      mutatedProducts.value = mockProducts.value.filter(
        p => p.id !== deleteProductId.value,
      )
      snackbar.message = 'Product deleted successfully'
      snackbar.color = 'success'
      snackbar.show = true
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }
</script>

<style scoped>
  .products-page {
    padding-top: 20px;
  }
</style>

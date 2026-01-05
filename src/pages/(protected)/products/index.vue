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
            @click="openCreateDialog"
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

    <!-- Create/Edit Dialog -->
    <ProductDialog
      ref="productDialogRef"
      v-model:open="dialogOpen"
      :editing-id="editingId"
      :categories-data="categoriesData || []"
      @save="handleSave"
    />

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
  import DeleteConfirmDialog from './components/DeleteConfirmDialog.vue'
  import ProductDialog from './components/ProductDialog.vue'
  import ProductTable from './components/ProductTable.vue'

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

  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingId = ref<string | null>(null)
  const deleteProductId = ref<string | null>(null)
  const productDialogRef = ref<InstanceType<typeof ProductDialog>>()

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function openCreateDialog() {
    editingId.value = null
    productDialogRef.value?.initializeCreate()
    dialogOpen.value = true
  }

  function openEditDialog(product: ProductData) {
    editingId.value = product.id
    productDialogRef.value?.initializeEdit(product)
    dialogOpen.value = true
  }

  function confirmDelete(id: string) {
    deleteProductId.value = id
    deleteDialogOpen.value = true
  }

  async function handleSave(
    productData: Omit<
      ProductData,
      'id' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
  ) {
    try {
      const currentData = mockProducts.value
      if (editingId.value) {
        // Update existing product
        const index = currentData.findIndex(p => p.id === editingId.value)
        if (index !== -1) {
          const updatedData = [...currentData]
          const currentProduct = updatedData[index]!
          updatedData[index] = {
            id: currentProduct.id,
            ...productData,
            created_at: currentProduct.created_at,
            updated_at: currentProduct.updated_at,
            deleted_at: currentProduct.deleted_at,
          }
          mutatedProducts.value = updatedData
        }
        snackbar.message = 'Product updated successfully'
      } else {
        // Create new product
        const newProduct: ProductData = {
          id: Date.now().toString(),
          ...productData,
          created_at: null,
          updated_at: null,
          deleted_at: null,
        }
        mutatedProducts.value = [...currentData, newProduct]
        snackbar.message = 'Product created successfully'
      }
      snackbar.color = 'success'
      snackbar.show = true
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
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

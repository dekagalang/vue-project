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
            <v-data-table
              class="elevation-0"
              :headers="headers"
              item-value="id"
              :items="mockProducts"
            >
              <template #[`item.price`]="{ item }">
                <span class="font-weight-bold"
                  >Rp
                  {{
                    (item as ProductData).price.toLocaleString('id-ID')
                  }}</span
                >
              </template>

              <template #[`item.stock`]="{ item }">
                <v-chip
                  :color="
                    (item as ProductData).stock > 50
                      ? 'success'
                      : (item as ProductData).stock > 10
                        ? 'warning'
                        : 'error'
                  "
                  size="small"
                  text-color="white"
                >
                  {{ (item as ProductData).stock }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item as ProductData)"
                />
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="confirmDelete((item as ProductData).id)"
                />
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialogOpen"
      max-width="800px"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ editingId ? 'Edit Product' : 'Create New Product' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleSave">
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="name.value.value"
                  :error-messages="
                    name.meta.touched ? name.errorMessage.value : []
                  "
                  label="Product Name"
                  outlined
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="categoryId.value.value"
                  item-title="name"
                  item-value="id"
                  :items="categoriesData || []"
                  :error-messages="
                    categoryId.meta.touched ? categoryId.errorMessage.value : []
                  "
                  label="Category"
                  outlined
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="price.value.value"
                  :error-messages="
                    price.meta.touched ? price.errorMessage.value : []
                  "
                  label="Price (Rp)"
                  outlined
                  type="number"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="stock.value.value"
                  :error-messages="
                    stock.meta.touched ? stock.errorMessage.value : []
                  "
                  label="Stock"
                  outlined
                  type="number"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description.value.value"
                  :error-messages="
                    description.meta.touched
                      ? description.errorMessage.value
                      : []
                  "
                  label="Description"
                  outlined
                  rows="4"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="false"
            @click="handleSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialogOpen"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this product?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="false"
            @click="handleDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  import { useField, useForm } from 'vee-validate'
  import {
    useCategories,
    useDeleteProduct,
    useProducts,
  } from '@/composables/useApi'

  const headers = [
    { title: 'Name', value: 'name', width: '20%' },
    { title: 'Description', value: 'description', width: '25%' },
    { title: 'Price', value: 'price', width: '15%' },
    { title: 'Stock', value: 'stock', width: '10%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

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

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value: string) {
        if (value && value.length >= 3) return true
        return 'Name must be at least 3 characters'
      },
      description(value: string) {
        if (value && value.length >= 10) return true
        return 'Description must be at least 10 characters'
      },
      price(value: number) {
        if (value && value > 0) return true
        return 'Price must be greater than 0'
      },
      categoryId(value: string) {
        if (value) return true
        return 'Category is required'
      },
      stock(value: number) {
        if (value !== null && value !== undefined && value >= 0) return true
        return 'Stock cannot be negative'
      },
    },
  })

  const name = useField<string>('name')
  const description = useField<string>('description')
  const price = useField<number>('price')
  const categoryId = useField<string>('categoryId')
  const stock = useField<number>('stock')

  function openCreateDialog() {
    editingId.value = null
    name.value.value = ''
    description.value.value = ''
    price.value.value = 0
    categoryId.value.value = ''
    stock.value.value = 0
    dialogOpen.value = true
  }

  function openEditDialog(item: ProductData) {
    editingId.value = item.id
    name.value.value = item.name
    description.value.value = item.description
    price.value.value = item.price
    categoryId.value.value = item.categoryId
    stock.value.value = item.stock
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingId.value = null
    handleReset()
  }

  const handleSave = handleSubmit(async () => {
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
            name: name.value.value as string,
            description: description.value.value as string,
            price: price.value.value as number,
            categoryId: categoryId.value.value as string,
            stock: stock.value.value as number,
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
          name: name.value.value as string,
          description: description.value.value as string,
          price: price.value.value as number,
          categoryId: categoryId.value.value as string,
          stock: stock.value.value as number,
          created_at: null,
          updated_at: null,
          deleted_at: null,
        }
        mutatedProducts.value = [...currentData, newProduct]
        snackbar.message = 'Product created successfully'
      }
      snackbar.color = 'success'
      snackbar.show = true
      closeDialog()
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  })

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
      deleteDialogOpen.value = false
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

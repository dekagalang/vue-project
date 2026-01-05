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
      <!-- <v-row
        v-if="products.isPending"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="table" />
          </v-card>
        </v-col>
      </v-row> -->

      <!-- Error State -->
      <!-- <v-row v-else-if="products.isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Products"
            type="error"
          >
            {{ products.error }}
          </v-alert>
        </v-col>
      </v-row> -->

      <!-- Data Table -->
      <!-- <v-row v-else> -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-data-table
              class="elevation-0"
              :headers="headers"
              item-value="id"
              :items="unref(products.data) || []"
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
                  v-model="form.name"
                  :error-messages="formErrors.name"
                  label="Product Name"
                  outlined
                  @blur="validateField('name')"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="form.categoryId"
                  item-title="name"
                  item-value="id"
                  :items="unref(categories.data) || []"
                  label="Category"
                  outlined
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="form.price"
                  :error-messages="formErrors.price"
                  label="Price (Rp)"
                  outlined
                  type="number"
                  @blur="validateField('price')"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="form.stock"
                  :error-messages="formErrors.stock"
                  label="Stock"
                  outlined
                  type="number"
                  @blur="validateField('stock')"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  :error-messages="formErrors.description"
                  label="Description"
                  outlined
                  rows="4"
                  @blur="validateField('description')"
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
            :loading="
              unref(createProduct.isPending) || unref(updateProduct.isPending)
            "
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
            :loading="unref(deleteProduct.isPending)"
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
  import {
    useCategories,
    useCreateProduct,
    useDeleteProduct,
    useProducts,
    useUpdateProduct,
  } from '@/composables/useApi'

  const headers = [
    { title: 'Name', value: 'name', width: '20%' },
    { title: 'Description', value: 'description', width: '25%' },
    { title: 'Price', value: 'price', width: '15%' },
    { title: 'Stock', value: 'stock', width: '10%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

  const products = useProducts()
  const categories = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingId = ref<string | null>(null)
  const deleteProductId = ref<string | null>(null)

  const form = reactive({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stock: 0,
  })

  const formErrors = reactive<Record<string, any>>({})

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    categoryId: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
  })

  function validateField(fieldName: string) {
    try {
      switch (fieldName) {
        case 'name': {
          z.string().min(3).parse(form.name)
          delete formErrors.name

          break
        }
        case 'description': {
          z.string().min(10).parse(form.description)
          delete formErrors.description

          break
        }
        case 'price': {
          z.number().positive().parse(form.price)
          delete formErrors.price

          break
        }
        case 'stock': {
          z.number().int().nonnegative().parse(form.stock)
          delete formErrors.stock

          break
        }
        // No default
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        formErrors[fieldName] = error.issues?.[0]?.message ?? 'Invalid field'
      }
    }
  }

  function openCreateDialog() {
    editingId.value = null
    form.name = ''
    form.description = ''
    form.price = 0
    form.categoryId = ''
    form.stock = 0
    formErrors.name = ''
    formErrors.description = ''
    formErrors.price = ''
    formErrors.stock = ''
    dialogOpen.value = true
  }

  function openEditDialog(item: ProductData) {
    editingId.value = item.id
    form.name = item.name
    form.description = item.description
    form.price = item.price
    form.categoryId = item.categoryId
    form.stock = item.stock
    formErrors.name = ''
    formErrors.description = ''
    formErrors.price = ''
    formErrors.stock = ''
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingId.value = null
  }

  async function handleSave() {
    try {
      productSchema.parse(form)
      formErrors.name = ''
      formErrors.description = ''
      formErrors.price = ''
      formErrors.stock = ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const err of error.issues) {
          const path = err.path[0] as string
          formErrors[path] = err.message
        }
      }
      return
    }

    try {
      if (editingId.value) {
        await updateProduct.mutateAsync({
          id: editingId.value,
          data: {
            name: form.name,
            description: form.description,
            price: form.price,
            categoryId: form.categoryId,
            stock: form.stock,
          },
        })
        snackbar.message = 'Product updated successfully'
      } else {
        await createProduct.mutateAsync({
          name: form.name,
          description: form.description,
          price: form.price,
          categoryId: form.categoryId,
          stock: form.stock,
        })
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
  }

  function confirmDelete(id: string) {
    deleteProductId.value = id
    deleteDialogOpen.value = true
  }

  async function handleDelete() {
    if (!deleteProductId.value) return

    try {
      await deleteProduct.mutateAsync(deleteProductId.value)
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

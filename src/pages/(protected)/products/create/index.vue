<template>
  <div class="product-create-page">
    <v-container fluid>
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center gap-3">
            <v-btn
              color="primary"
              icon="mdi-arrow-left"
              size="small"
              variant="text"
              @click="goBack"
            />
            <h1 class="text-h4">Create New Product</h1>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-6">
              <v-form @submit.prevent="onSubmit">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="productForm.name.value.value"
                      :error-messages="
                        productForm.name.meta.touched
                          ? productForm.name.errorMessage.value
                          : []
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
                      v-model="productForm.categoryId.value.value"
                      item-title="name"
                      item-value="id"
                      :items="productForm.categoriesData.value"
                      :error-messages="
                        productForm.categoryId.meta.touched
                          ? productForm.categoryId.errorMessage.value
                          : []
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
                      v-model.number="productForm.price.value.value"
                      :error-messages="
                        productForm.price.meta.touched
                          ? productForm.price.errorMessage.value
                          : []
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
                      v-model.number="productForm.stock.value.value"
                      :error-messages="
                        productForm.stock.meta.touched
                          ? productForm.stock.errorMessage.value
                          : []
                      "
                      label="Stock"
                      outlined
                      type="number"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="productForm.description.value.value"
                      :error-messages="
                        productForm.description.meta.touched
                          ? productForm.description.errorMessage.value
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
              <v-btn @click="goBack">Cancel</v-btn>
              <v-btn
                color="primary"
                @click="onSubmit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

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
  import { useCategories, useCreateProduct } from '@/composables'
  import { useProductForm } from '../_hooks/useProductForm'

  const router = useRouter()

  definePage({
    path: '/products/create',
    meta: {
      requiresAuth: true,
    },
  })

  const { data: categoriesData } = useCategories()
  const createProduct = useCreateProduct()

  const categoriesDataComputed = computed(() => categoriesData.value || [])
  const productForm = useProductForm(categoriesDataComputed)

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function goBack() {
    router.back()
  }

  const onSubmit = productForm.handleSubmit(async () => {
    try {
      await createProduct.mutateAsync({
        name: productForm.name.value.value as string,
        description: productForm.description.value.value as string,
        price: productForm.price.value.value as number,
        categoryId: productForm.categoryId.value.value as string,
        stock: productForm.stock.value.value as number,
      })

      snackbar.color = 'success'
      snackbar.message = 'Product created successfully'
      snackbar.show = true

      setTimeout(() => {
        router.push('/products')
      }, 1500)
    } catch (error: any) {
      snackbar.color = 'error'
      snackbar.message = error?.message || 'Failed to create product'
      snackbar.show = true
    }
  })

  onMounted(() => {
    productForm.initializeForCreate()
  })
</script>

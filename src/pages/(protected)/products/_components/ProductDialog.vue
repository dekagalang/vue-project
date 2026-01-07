<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="800px"
    @update:model-value="onDialogClose"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
      </v-card-title>

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
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          @click="onSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { ProductData } from '@/api/mock'
  import { useProductForm } from '../_hooks/useProductForm'

  const props = defineProps<{
    open: boolean
    editingId: string | null
    categoriesData: any[]
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    save: [
      data: Omit<
        ProductData,
        'id' | 'created_at' | 'updated_at' | 'deleted_at'
      >,
    ]
  }>()

  const categoriesDataComputed = computed(() => props.categoriesData)
  const productForm = useProductForm(categoriesDataComputed)

  const dialogOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const isEditMode = computed(() => props.editingId !== null)

  function closeDialog() {
    dialogOpen.value = false
    productForm.reset()
  }

  function onDialogClose(value: boolean) {
    if (!value) {
      productForm.reset()
    }
  }

  const onSubmit = productForm.handleSubmit(async () => {
    try {
      emit('save', {
        name: productForm.name.value.value as string,
        description: productForm.description.value.value as string,
        price: productForm.price.value.value as number,
        categoryId: productForm.categoryId.value.value as string,
        stock: productForm.stock.value.value as number,
      })
      closeDialog()
    } catch {
      console.error('Form submission error')
    }
  })

  function initializeCreate() {
    productForm.initializeForCreate()
  }

  function initializeEdit(product: ProductData) {
    productForm.initializeForEdit(product)
  }

  defineExpose({
    initializeCreate,
    initializeEdit,
  })
</script>

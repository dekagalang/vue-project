<template>
  <div class="category-create-page">
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
            <h1 class="text-h4">Create New Category</h1>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-6">
              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  v-model="categoryForm.name.value.value"
                  class="mb-4"
                  :error-messages="
                    categoryForm.name.meta.touched
                      ? categoryForm.name.errorMessage.value
                      : []
                  "
                  label="Category Name"
                  outlined
                />

                <v-textarea
                  v-model="categoryForm.description.value.value"
                  class="mb-4"
                  :error-messages="
                    categoryForm.description.meta.touched
                      ? categoryForm.description.errorMessage.value
                      : []
                  "
                  label="Description"
                  outlined
                  rows="3"
                />

                <v-select
                  v-model="categoryForm.type.value.value"
                  class="mb-4"
                  :error-messages="
                    categoryForm.type.meta.touched
                      ? categoryForm.type.errorMessage.value
                      : []
                  "
                  :items="categoryForm.typeOptions.value"
                  item-title="title"
                  item-value="value"
                  label="Type"
                  outlined
                />

                <v-select
                  v-model="categoryForm.parentId.value.value"
                  class="mb-4"
                  clearable
                  item-title="name"
                  item-value="id"
                  :items="categoryForm.parentCategories.value"
                  label="Parent Category (Optional - for subcategory)"
                  outlined
                />
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
  import { useCategories, useCreateCategory } from '@/_hooks/categories'
  import { useCategoryForm } from '../_hooks/useCategoryForm'

  const router = useRouter()

  definePage({
    path: '/categories/create',
    meta: {
      requiresAuth: true,
    },
  })

  const { data: categoriesData } = useCategories()
  const createCategory = useCreateCategory()

  const mockCategoriesComputed = computed(() => categoriesData.value || [])
  const categoryForm = useCategoryForm(mockCategoriesComputed)

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function goBack() {
    router.back()
  }

  const onSubmit = categoryForm.handleSubmit(async () => {
    try {
      await createCategory.mutateAsync({
        name: categoryForm.name.value.value as string,
        description: categoryForm.description.value.value as string,
        type: categoryForm.type.value.value as 'category' | 'subcategory',
        parentId: categoryForm.parentId.value.value,
      })

      snackbar.color = 'success'
      snackbar.message = 'Category created successfully'
      snackbar.show = true

      setTimeout(() => {
        router.push('/categories')
      }, 1500)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create category'
      snackbar.color = 'error'
      snackbar.message = message
      snackbar.show = true
    }
  })

  onMounted(() => {
    categoryForm.initializeForCreate()
  })
</script>

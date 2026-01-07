<template>
  <div class="category-update-page">
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
            <h1 class="text-h4">Update Category</h1>
          </div>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row
        v-if="categoryLoading"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="card" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Data -->
      <v-row v-else>
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
  import { useCategories, useUpdateCategory } from '@/_hooks/categories'
  import { useCategoryForm } from '../../_hooks/useCategoryForm'

  const router = useRouter()
  const route = useRoute()

  definePage({
    path: '/categories/:id/update',
    meta: {
      requiresAuth: true,
    },
  })

  const categoryId = computed(() => {
    const id = (route.params as Record<string, string>).id
    return Array.isArray(id) ? id[0] : id
  })

  const { data: categoriesData, isPending: categoryLoading } = useCategories()
  const updateCategory = useUpdateCategory()

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
    if (!categoryId.value) return

    try {
      await updateCategory.mutateAsync({
        id: categoryId.value,
        data: {
          name: categoryForm.name.value.value as string,
          description: categoryForm.description.value.value as string,
          type: categoryForm.type.value.value as 'category' | 'subcategory',
          parentId: categoryForm.parentId.value.value,
        },
      })

      snackbar.color = 'success'
      snackbar.message = 'Category updated successfully'
      snackbar.show = true

      setTimeout(() => {
        router.push(`/categories/${categoryId.value}`)
      }, 1500)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update category'
      snackbar.color = 'error'
      snackbar.message = message
      snackbar.show = true
    }
  })

  onMounted(() => {
    const category = categoriesData.value?.find(c => c.id === categoryId.value)
    if (category) {
      categoryForm.initializeForEdit(category)
    }
  })

  watch(categoriesData, newCategories => {
    if (newCategories) {
      const category = newCategories.find(c => c.id === categoryId.value)
      if (category) {
        categoryForm.initializeForEdit(category)
      }
    }
  })
</script>

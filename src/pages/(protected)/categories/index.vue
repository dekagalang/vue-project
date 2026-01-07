<template>
  <div class="categories-page">
    <v-container fluid>
      <v-row
        align="center"
        class="mb-6"
      >
        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-h4">Category Management</h1>
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
            :to="{ path: '/categories/create' }"
          >
            Add Category
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
            <v-skeleton-loader type="list-item@3" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Categories"
            type="error"
          >
            {{ error?.message || 'Failed to load categories' }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- Tree View with Expansion -->
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <CategoryTable
              :tree-items="treeItems"
              :expanded="expanded"
              :pagination="pagination"
              :parent-ids-with-children="parentIdsWithChildren"
              :all-categories="mockCategories"
              @update:expanded="expanded = $event"
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
  import type { CategoryData } from '@/api/mock'
  import { useCategories, useDeleteCategory } from '@/_hooks/categories'
  import CategoryTable from './_components/CategoryTable.vue'
  import DeleteConfirmDialog from './_components/DeleteConfirmDialog.vue'

  const router = useRouter()

  definePage({
    path: '/categories',
    meta: {
      requiresAuth: true,
    },
  })

  // Get categories from composables
  const { data: categoriesData, isPending, isError, error } = useCategories()
  const deleteCategory = useDeleteCategory()

  // Local ref for mutations
  const mutatedCategories = ref<CategoryData[] | null>(null)

  // mockCategories reactively shows composables data or local mutations
  const mockCategories = computed(
    () => mutatedCategories.value || categoriesData.value || [],
  )

  const deleteDialogOpen = ref(false)
  const deleteCategoryId = ref<string | null>(null)
  const expanded = ref<string[]>([])
  const pagination = ref({ page: 1, itemsPerPage: -1 })

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const treeItems = computed(() => {
    return mockCategories.value || []
  })

  const parentIdsWithChildren = computed(() => {
    const allCategories = mockCategories.value
    if (!allCategories) return new Set<string>()

    const ids = new Set<string>()
    for (const category of allCategories) {
      if (category.parentId) {
        ids.add(category.parentId)
      }
    }
    return ids
  })

  function openEditDialog(item: CategoryData) {
    router.push(`/categories/${item.id}/edit`)
  }

  function confirmDelete(id: string) {
    deleteCategoryId.value = id
    deleteDialogOpen.value = true
  }

  async function handleDelete() {
    if (!deleteCategoryId.value) return

    try {
      await deleteCategory.mutateAsync(deleteCategoryId.value)
      mutatedCategories.value = mockCategories.value.filter(
        c => c.id !== deleteCategoryId.value,
      )
      snackbar.message = 'Category deleted successfully'
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
  .categories-page {
    padding-top: 20px;
  }
</style>

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
            @click="openCreateDialog"
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
              @update:expanded="expanded = $event"
              @edit="openEditDialog"
              @delete="confirmDelete"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Create/Edit Dialog -->
    <CategoryDialog
      ref="categoryDialogRef"
      v-model:open="dialogOpen"
      :editing-id="editingId"
      :mock-categories="mockCategories"
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
  import type { CategoryData } from '@/api/mock'
  import { useCategories, useDeleteCategory } from '@/composables/useApi'
  import CategoryDialog from './components/CategoryDialog.vue'
  import CategoryTable from './components/CategoryTable.vue'
  import DeleteConfirmDialog from './components/DeleteConfirmDialog.vue'

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

  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingId = ref<string | null>(null)
  const deleteCategoryId = ref<string | null>(null)
  const expanded = ref<CategoryData[]>([])
  const pagination = ref({ page: 1, itemsPerPage: -1 })
  const categoryDialogRef = ref<InstanceType<typeof CategoryDialog>>()

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const treeItems = computed(() => {
    const allCategories = mockCategories.value
    if (!allCategories) return []

    const result: CategoryData[] = []

    // Add parent categories first
    const parents = allCategories.filter((c: CategoryData) => !c.parentId)
    for (const parent of parents) {
      result.push(parent)

      // Add children if parent is expanded
      if (expanded.value.some(e => e.id === parent.id)) {
        const children = allCategories.filter(
          (c: CategoryData) => c.parentId === parent.id,
        )
        result.push(...children)
      }
    }

    return result
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

  function openCreateDialog() {
    editingId.value = null
    categoryDialogRef.value?.initializeCreate()
    dialogOpen.value = true
  }

  function openEditDialog(item: CategoryData) {
    editingId.value = item.id
    categoryDialogRef.value?.initializeEdit(item)
    dialogOpen.value = true
  }

  function confirmDelete(id: string) {
    deleteCategoryId.value = id
    deleteDialogOpen.value = true
  }

  async function handleSave(
    categoryData: Omit<
      CategoryData,
      'id' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
  ) {
    try {
      const currentData = mockCategories.value
      if (editingId.value) {
        // Update existing category
        const index = currentData.findIndex(c => c.id === editingId.value)
        if (index !== -1) {
          const updatedData = [...currentData]
          const currentCategory = updatedData[index]!
          updatedData[index] = {
            id: currentCategory.id,
            ...categoryData,
            created_at: currentCategory.created_at,
            updated_at: currentCategory.updated_at,
            deleted_at: currentCategory.deleted_at,
          }
          mutatedCategories.value = updatedData
        }
        snackbar.message = 'Category updated successfully'
      } else {
        // Create new category
        const newCategory: CategoryData = {
          id: Date.now().toString(),
          ...categoryData,
          created_at: null,
          updated_at: null,
          deleted_at: null,
        }
        mutatedCategories.value = [...currentData, newCategory]
        snackbar.message = 'Category created successfully'
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

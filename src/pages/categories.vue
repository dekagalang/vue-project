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
            <v-data-table
              class="elevation-0"
              :headers="headers"
              :item-key="getItemKey"
              item-value="id"
              :items="treeItems"
              :pagination="pagination"
              @update:expanded="expanded = $event"
            >
              <template #[`item.data-table-expand`]="{ item }">
                <v-btn
                  v-if="hasChildren(item.id)"
                  :icon="
                    expanded.some((e: CategoryData) => e.id === item.id)
                      ? 'mdi-chevron-down'
                      : 'mdi-chevron-right'
                  "
                  size="small"
                  variant="text"
                  @click.stop="toggleExpand(item as CategoryData)"
                />
              </template>

              <template #[`item.name`]="{ item }">
                <span :style="{ paddingLeft: item.parentId ? '32px' : '0' }">
                  {{ item.name }}
                </span>
              </template>

              <template #[`item.type`]="{ item }">
                <v-chip
                  :color="item.parentId ? 'primary' : 'secondary'"
                  size="small"
                >
                  {{ item.parentId ? 'Subcategory' : 'Category' }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item)"
                />
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="confirmDelete(item.id)"
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
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ editingId ? 'Edit Category' : 'Create New Category' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleSave">
            <v-text-field
              v-model="name.value.value"
              class="mb-4"
              :error-messages="name.meta.touched ? name.errorMessage.value : []"
              label="Category Name"
              outlined
            />

            <v-textarea
              v-model="description.value.value"
              class="mb-4"
              :error-messages="
                description.meta.touched ? description.errorMessage.value : []
              "
              label="Description"
              outlined
              rows="3"
            />

            <v-select
              v-model="parentId.value.value"
              class="mb-4"
              clearable
              item-title="name"
              item-value="id"
              :items="parentCategories"
              label="Parent Category (Optional - for subcategory)"
              outlined
            />
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
        <v-card-text>
          Are you sure you want to delete this category?</v-card-text
        >
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
  import type { CategoryData } from '@/api/mock'
  import { useField, useForm } from 'vee-validate'
  import { useCategories, useDeleteCategory } from '@/composables/useApi'

  const headers = [
    { title: '', value: 'data-table-expand', width: '40px' },
    { title: 'Name', value: 'name', width: '40%' },
    { title: 'Type', value: 'type', width: '20%' },
    { title: 'Description', value: 'description', width: '30%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

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
      parentId(_value: string | null) {
        return true
      },
    },
  })

  const name = useField<string>('name')
  const description = useField<string>('description')
  const parentId = useField<string | null>('parentId')

  const parentCategories = computed(() => {
    return mockCategories.value.filter((c: CategoryData) => !c.parentId)
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

  function hasChildren(categoryId: string) {
    return mockCategories.value.some(
      (c: CategoryData) => c.parentId === categoryId,
    )
  }

  const getItemKey = (item: any) => item.id

  function toggleExpand(item: CategoryData) {
    const index = expanded.value.findIndex(e => e.id === item.id)
    if (index === -1) {
      expanded.value.push(item)
    } else {
      expanded.value.splice(index, 1)
    }
  }

  function openCreateDialog() {
    editingId.value = null
    name.value.value = ''
    description.value.value = ''
    parentId.value.value = null
    dialogOpen.value = true
  }

  function openEditDialog(item: CategoryData) {
    editingId.value = item.id
    name.value.value = item.name
    description.value.value = item.description
    parentId.value.value = item.parentId || null
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingId.value = null
    handleReset()
  }

  const handleSave = handleSubmit(async () => {
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
            name: name.value.value as string,
            description: description.value.value as string,
            parentId: parentId.value.value,
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
          name: name.value.value as string,
          description: description.value.value as string,
          parentId: parentId.value.value,
          created_at: null,
          updated_at: null,
          deleted_at: null,
        }
        mutatedCategories.value = [...currentData, newCategory]
        snackbar.message = 'Category created successfully'
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
      deleteDialogOpen.value = false
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

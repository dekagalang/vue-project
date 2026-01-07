<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="600px"
    @update:model-value="onDialogClose"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ isEditMode ? 'Edit Category' : 'Create New Category' }}
      </v-card-title>

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
  import type { CategoryData } from '@/api/mock'
  import { useCategoryForm } from '../_hooks/useCategoryForm'

  const props = defineProps<{
    open: boolean
    editingId: string | null
    mockCategories: CategoryData[]
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    save: [
      data: Omit<
        CategoryData,
        'id' | 'created_at' | 'updated_at' | 'deleted_at'
      >,
    ]
  }>()

  const mockCategoriesComputed = computed(() => props.mockCategories)
  const categoryForm = useCategoryForm(mockCategoriesComputed)

  const dialogOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const isEditMode = computed(() => props.editingId !== null)

  function closeDialog() {
    dialogOpen.value = false
    categoryForm.reset()
  }

  function onDialogClose(value: boolean) {
    if (!value) {
      categoryForm.reset()
    }
  }

  const onSubmit = categoryForm.handleSubmit(async () => {
    try {
      emit('save', {
        name: categoryForm.name.value.value as string,
        description: categoryForm.description.value.value as string,
        type: categoryForm.type.value.value as 'category' | 'subcategory',
        parentId: categoryForm.parentId.value.value,
      })
      closeDialog()
    } catch {
      console.error('Form submission error')
    }
  })

  function initializeCreate() {
    categoryForm.initializeForCreate()
  }

  function initializeEdit(category: CategoryData) {
    categoryForm.initializeForEdit(category)
  }

  defineExpose({
    initializeCreate,
    initializeEdit,
  })
</script>

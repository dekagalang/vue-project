import type { Ref } from 'vue'
import type { CategoryData } from '@/api/mock'
import { useField, useForm } from 'vee-validate'

export function useCategoryForm(mockCategories: Ref<CategoryData[]>) {
  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value: string) {
        if (value && value.length >= 3) {
          return true
        }
        return 'Name must be at least 3 characters'
      },
      description(value: string) {
        if (value && value.length >= 10) {
          return true
        }
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

  function initializeForCreate() {
    name.value.value = ''
    description.value.value = ''
    parentId.value.value = null
  }

  function initializeForEdit(category: CategoryData) {
    name.value.value = category.name
    description.value.value = category.description
    parentId.value.value = category.parentId || null
  }

  function reset() {
    handleReset()
  }

  return {
    name,
    description,
    parentId,
    parentCategories,
    handleSubmit,
    initializeForCreate,
    initializeForEdit,
    reset,
  }
}

import type { Ref } from 'vue'
import type { CategoryData } from '@/api/mock'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    type: z.enum(['category', 'subcategory']),
    parentId: z.string().nullable().optional(),
  }),
)

export function useCategoryForm(mockCategories: Ref<CategoryData[]>) {
  const { handleSubmit, handleReset } = useForm({
    validationSchema,
  })

  const name = useField<string>('name')
  const description = useField<string>('description')
  const type = useField<'category' | 'subcategory'>('type')
  const parentId = useField<string | null>('parentId')

  const typeOptions = computed(() => [
    { title: 'Category', value: 'category' },
    { title: 'Subcategory', value: 'subcategory' },
  ])

  const parentCategories = computed(() => {
    return mockCategories.value.filter((c: CategoryData) => !c.parentId)
  })

  function initializeForCreate() {
    name.value.value = ''
    description.value.value = ''
    type.value.value = 'category'
    parentId.value.value = null
  }

  function initializeForEdit(category: CategoryData) {
    name.value.value = category.name
    description.value.value = category.description
    type.value.value = category.type
    parentId.value.value = category.parentId || null
  }

  function reset() {
    handleReset()
  }

  return {
    name,
    description,
    type,
    typeOptions,
    parentId,
    parentCategories,
    handleSubmit,
    initializeForCreate,
    initializeForEdit,
    reset,
  }
}

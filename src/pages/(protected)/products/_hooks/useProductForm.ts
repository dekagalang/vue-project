import type { Ref } from 'vue'
import type { Category, ProductData } from '@/api/mock'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    categoryId: z.string().min(1, 'Category is required'),
    stock: z.number().nonnegative('Stock cannot be negative'),
  }),
)

export function useProductForm(categoriesData: Ref<Category[]>) {
  const { handleSubmit, handleReset } = useForm({
    validationSchema,
  })

  const name = useField<string>('name')
  const description = useField<string>('description')
  const price = useField<number>('price')
  const categoryId = useField<string>('categoryId')
  const stock = useField<number>('stock')

  function initializeForCreate() {
    name.value.value = ''
    description.value.value = ''
    price.value.value = 0
    categoryId.value.value = ''
    stock.value.value = 0
  }

  function initializeForEdit(product: ProductData) {
    name.value.value = product.name
    description.value.value = product.description
    price.value.value = product.price
    categoryId.value.value = product.categoryId
    stock.value.value = product.stock
  }

  function reset() {
    handleReset()
  }

  return {
    name,
    description,
    price,
    categoryId,
    stock,
    categoriesData,
    handleSubmit,
    initializeForCreate,
    initializeForEdit,
    reset,
  }
}

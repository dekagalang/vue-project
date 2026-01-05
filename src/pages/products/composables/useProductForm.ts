import type { Ref } from 'vue'
import type { ProductData } from '@/api/mock'
import { useField, useForm } from 'vee-validate'

export function useProductForm(categoriesData: Ref<any[]>) {
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
      price(value: number) {
        if (value && value > 0) {
          return true
        }
        return 'Price must be greater than 0'
      },
      categoryId(value: string) {
        if (value) {
          return true
        }
        return 'Category is required'
      },
      stock(value: number) {
        if (value !== null && value !== undefined && value >= 0) {
          return true
        }
        return 'Stock cannot be negative'
      },
    },
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

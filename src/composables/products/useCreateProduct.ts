import type { TProductCreateRequest } from '@/api/type'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createProduct } from '@/api/mock'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TProductCreateRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

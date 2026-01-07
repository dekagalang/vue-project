import type { TProductUpdateRequest } from '@/_types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateProduct } from '@/api/mock'

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TProductUpdateRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

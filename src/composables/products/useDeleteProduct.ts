import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteProduct } from '@/api/mock'

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteCategory } from '@/api/mock'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

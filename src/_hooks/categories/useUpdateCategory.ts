import type { TCategoryUpdateRequest } from '@/_types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateCategory } from '@/api/mock'

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TCategoryUpdateRequest }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

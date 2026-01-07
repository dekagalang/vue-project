import type { TCategoryCreateRequest } from '@/_types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createCategory } from '@/api/mock'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCategoryCreateRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

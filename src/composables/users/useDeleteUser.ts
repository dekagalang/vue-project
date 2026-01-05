import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteUser } from '@/api/mock'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

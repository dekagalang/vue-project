import type { TUserUpdateRequest } from '@/api/type'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateUser } from '@/api/mock'

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUserUpdateRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

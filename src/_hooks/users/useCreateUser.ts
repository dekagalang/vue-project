import type { TUserCreateRequest } from '@/_types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createUser } from '@/api/mock'

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUserCreateRequest) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

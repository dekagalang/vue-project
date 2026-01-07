import { useQuery } from '@tanstack/vue-query'
import { getUser } from '@/api/mock'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

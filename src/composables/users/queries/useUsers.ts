import { useQuery } from '@tanstack/vue-query'
import { getUsers } from '@/api/mock'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

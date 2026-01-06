import { useQuery } from '@tanstack/vue-query'
import { getCategories } from '@/api/mock'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

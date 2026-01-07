import { useQuery } from '@tanstack/vue-query'
import { getCategory } from '@/api/mock'

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  })
}

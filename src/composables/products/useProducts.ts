import { useQuery } from '@tanstack/vue-query'
import { getProducts } from '@/api/mock'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

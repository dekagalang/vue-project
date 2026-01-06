import { useQuery } from '@tanstack/vue-query'
import { getProduct } from '@/api/mock'

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

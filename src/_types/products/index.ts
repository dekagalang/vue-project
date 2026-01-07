// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  stock: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface TProductListResponse {
  status_code: number
  data: {
    items: Product[]
    meta: {
      total_page: number
      total: number
      page: number
      per_page: number
    }
  }
  version: string
}

export interface TProductDetailResponse {
  status_code: number
  data: Product
  version: string
}

export interface TGetProductsParams {
  page?: number
  per_page?: number
  search?: string
  categoryId?: string
}

export interface TProductCreateRequest {
  name: string
  description: string
  price: number
  categoryId: string
  stock: number
}

export interface TProductUpdateRequest {
  name?: string
  description?: string
  price?: number
  categoryId?: string
  stock?: number
}

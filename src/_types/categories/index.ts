// Category Types
export interface Category {
  id: string
  name: string
  description: string
  type: 'category' | 'subcategory'
  parentId: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface TCategoryListResponse {
  status_code: number
  data: {
    items: Category[]
    meta: {
      total_page: number
      total: number
      page: number
      per_page: number
    }
  }
  version: string
}

export interface TCategoryDetailResponse {
  status_code: number
  data: Category
  version: string
}

export interface TGetCategoriesParams {
  page?: number
  per_page?: number
  search?: string
}

export interface TCategoryCreateRequest {
  name: string
  description: string
  type: 'category' | 'subcategory'
  parentId: string | null
}

export interface TCategoryUpdateRequest {
  name?: string
  description?: string
  type?: 'category' | 'subcategory'
  parentId?: string | null
}

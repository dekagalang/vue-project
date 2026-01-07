// User Types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  phones: { label: string; number: string }[]
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface TUserListResponse {
  status_code: number
  data: {
    items: User[]
    meta: {
      total_page: number
      total: number
      page: number
      per_page: number
    }
  }
  version: string
}

export interface TUserDetailResponse {
  status_code: number
  data: User
  version: string
}

export interface TGetUsersParams {
  page?: number
  per_page?: number
  search?: string
}

export interface TUserCreateRequest {
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  phones: { label: string; number: string }[]
}

export interface TUserUpdateRequest {
  name?: string
  email?: string
  role?: 'admin' | 'manager' | 'user'
  phones?: { label: string; number: string }[]
}

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

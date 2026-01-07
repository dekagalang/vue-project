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

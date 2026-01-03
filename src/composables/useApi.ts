import type {
  TCategoryCreateRequest,
  TCategoryUpdateRequest,
  TProductCreateRequest,
  TProductUpdateRequest,
  TUserCreateRequest,
  TUserUpdateRequest,
} from '@/api/type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createCategory,
  createProduct,
  createUser,
  deleteCategory,
  deleteProduct,
  deleteUser,
  getCategories,
  getCategory,
  getProduct,
  getProducts,
  getUser,
  getUsers,
  updateCategory,
  updateProduct,
  updateUser,
} from '@/api/mock'

// User Queries
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUserCreateRequest) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUserUpdateRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Product Queries
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TProductCreateRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TProductUpdateRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Category Queries
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ page: 1, per_page: 10 }),
    select: data => data.data.items,
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCategoryCreateRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TCategoryUpdateRequest }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

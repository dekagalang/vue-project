import type {
  Category,
  Product,
  TCategoryCreateRequest,
  TCategoryDetailResponse,
  TCategoryListResponse,
  TCategoryUpdateRequest,
  TGetCategoriesParams,
  TGetProductsParams,
  TGetUsersParams,
  TProductCreateRequest,
  TProductDetailResponse,
  TProductListResponse,
  TProductUpdateRequest,
  TUserCreateRequest,
  TUserDetailResponse,
  TUserListResponse,
  TUserUpdateRequest,
  User,
} from './type'

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    email: 'ahmad@example.com',
    role: 'manager',
    phones: [
      { label: 'Primary', number: '08123456789' },
      { label: 'Office', number: '021234567' },
    ],
    created_at: '2024-01-15',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti@example.com',
    role: 'user',
    phones: [{ label: 'Primary', number: '08987654321' }],
    created_at: '2024-02-10',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    role: 'user',
    phones: [
      { label: 'Primary', number: '08567890123' },
      { label: 'Home', number: '0213456789' },
    ],
    created_at: '2024-01-20',
    updated_at: null,
    deleted_at: null,
  },
]

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 15_000_000,
    categoryId: '1',
    stock: 25,
    created_at: '2024-01-10',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 250_000,
    categoryId: '2',
    stock: 150,
    created_at: '2024-01-12',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '3',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub',
    price: 500_000,
    categoryId: '2',
    stock: 80,
    created_at: '2024-01-15',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '4',
    name: 'Monitor 27"',
    description: '4K UHD Monitor',
    price: 3_500_000,
    categoryId: '3',
    stock: 15,
    created_at: '2024-01-18',
    updated_at: null,
    deleted_at: null,
  },
]

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Computers',
    description: 'Desktop and laptop computers',
    parentId: null,
    created_at: '2024-01-01',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Accessories',
    description: 'Computer accessories',
    parentId: null,
    created_at: '2024-01-01',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '3',
    name: 'Peripherals',
    description: 'Input/Output devices',
    parentId: null,
    created_at: '2024-01-01',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '4',
    name: 'Keyboards',
    description: 'Computer keyboards',
    parentId: '2',
    created_at: '2024-01-05',
    updated_at: null,
    deleted_at: null,
  },
  {
    id: '5',
    name: 'Mice',
    description: 'Computer mice',
    parentId: '2',
    created_at: '2024-01-05',
    updated_at: null,
    deleted_at: null,
  },
]

// =============== USER API ===============
export function getUsers(params: TGetUsersParams): Promise<TUserListResponse> {
  return Promise.resolve({
    status_code: 200,
    data: {
      items: mockUsers,
      meta: {
        total_page: 1,
        total: mockUsers.length,
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    },
    version: '1.0.0',
  })
}

export function getUser(id: string): Promise<TUserDetailResponse> {
  const user = mockUsers.find(u => u.id === id)
  return Promise.resolve({
    status_code: 200,
    data:
      user ||
      ({
        id: '',
        name: '',
        email: '',
        role: 'user',
        phones: [],
        created_at: null,
        updated_at: null,
        deleted_at: null,
      } as User),
    version: '1.0.0',
  })
}

export function createUser(
  data: TUserCreateRequest,
): Promise<TUserDetailResponse> {
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const newUser: User = {
    ...data,
    id: String(Math.random()).slice(2),
    created_at: dateStr,
    updated_at: null,
    deleted_at: null,
  }
  mockUsers.push(newUser)
  return Promise.resolve({
    status_code: 200,
    data: newUser,
    version: '1.0.0',
  })
}

export function updateUser(
  id: string,
  data: TUserUpdateRequest,
): Promise<TUserDetailResponse> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        email: '',
        role: 'user',
        phones: [],
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const original = mockUsers[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: User = {
    id: original.id,
    created_at: original.created_at,
    updated_at: dateStr,
    deleted_at: null,
    name: data.name ?? original.name,
    email: data.email ?? original.email,
    role: data.role ?? original.role,
    phones: data.phones ?? original.phones,
  }
  mockUsers[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

export function deleteUser(id: string): Promise<TUserDetailResponse> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        email: '',
        role: 'user',
        phones: [],
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const user = mockUsers[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: User = {
    ...user,
    deleted_at: dateStr,
  }
  mockUsers[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

// =============== PRODUCT API ===============
export function getProducts(
  params: TGetProductsParams,
): Promise<TProductListResponse> {
  return Promise.resolve({
    status_code: 200,
    data: {
      items: mockProducts,
      meta: {
        total_page: 1,
        total: mockProducts.length,
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    },
    version: '1.0.0',
  })
}

export function getProduct(id: string): Promise<TProductDetailResponse> {
  const product = mockProducts.find(p => p.id === id)
  return Promise.resolve({
    status_code: 200,
    data:
      product ||
      ({
        id: '',
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stock: 0,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      } as Product),
    version: '1.0.0',
  })
}

export function createProduct(
  data: TProductCreateRequest,
): Promise<TProductDetailResponse> {
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const newProduct: Product = {
    ...data,
    id: String(Math.random()).slice(2),
    created_at: dateStr,
    updated_at: null,
    deleted_at: null,
  }
  mockProducts.push(newProduct)
  return Promise.resolve({
    status_code: 200,
    data: newProduct,
    version: '1.0.0',
  })
}

export function updateProduct(
  id: string,
  data: TProductUpdateRequest,
): Promise<TProductDetailResponse> {
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stock: 0,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const original = mockProducts[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: Product = {
    id: original.id,
    created_at: original.created_at,
    updated_at: dateStr,
    deleted_at: null,
    name: data.name ?? original.name,
    description: data.description ?? original.description,
    price: data.price ?? original.price,
    categoryId: data.categoryId ?? original.categoryId,
    stock: data.stock ?? original.stock,
  }
  mockProducts[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

export function deleteProduct(id: string): Promise<TProductDetailResponse> {
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stock: 0,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const product = mockProducts[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: Product = {
    ...product,
    deleted_at: dateStr,
  }
  mockProducts[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

// =============== CATEGORY API ===============
export function getCategories(
  params: TGetCategoriesParams,
): Promise<TCategoryListResponse> {
  return Promise.resolve({
    status_code: 200,
    data: {
      items: mockCategories,
      meta: {
        total_page: 1,
        total: mockCategories.length,
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    },
    version: '1.0.0',
  })
}

export function getCategory(id: string): Promise<TCategoryDetailResponse> {
  const category = mockCategories.find(c => c.id === id)
  return Promise.resolve({
    status_code: 200,
    data:
      category ||
      ({
        id: '',
        name: '',
        description: '',
        parentId: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      } as Category),
    version: '1.0.0',
  })
}

export function createCategory(
  data: TCategoryCreateRequest,
): Promise<TCategoryDetailResponse> {
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const newCategory: Category = {
    ...data,
    id: String(Math.random()).slice(2),
    created_at: dateStr,
    updated_at: null,
    deleted_at: null,
  }
  mockCategories.push(newCategory)
  return Promise.resolve({
    status_code: 200,
    data: newCategory,
    version: '1.0.0',
  })
}

export function updateCategory(
  id: string,
  data: TCategoryUpdateRequest,
): Promise<TCategoryDetailResponse> {
  const index = mockCategories.findIndex(c => c.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        description: '',
        parentId: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const original = mockCategories[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: Category = {
    id: original.id,
    created_at: original.created_at,
    updated_at: dateStr,
    deleted_at: null,
    name: data.name ?? original.name,
    description: data.description ?? original.description,
    parentId: data.parentId ?? original.parentId,
  }
  mockCategories[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

export function deleteCategory(id: string): Promise<TCategoryDetailResponse> {
  const index = mockCategories.findIndex(c => c.id === id)
  if (index === -1) {
    return Promise.resolve({
      status_code: 404,
      data: {
        id: '',
        name: '',
        description: '',
        parentId: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      version: '1.0.0',
    })
  }
  const category = mockCategories[index]!
  const dateStr = new Date().toISOString().split('T')[0] || '2024-01-01'
  const updated: Category = {
    ...category,
    deleted_at: dateStr,
  }
  mockCategories[index] = updated
  return Promise.resolve({
    status_code: 200,
    data: updated,
    version: '1.0.0',
  })
}

// Export type aliases for components
export type CategoryData = Category
export type ProductData = Product
export type UserData = User

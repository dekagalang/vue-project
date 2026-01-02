export interface UserData {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  phones: { label: string; number: string }[]
  createdAt: string
}

export interface ProductData {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  stock: number
  createdAt: string
}

export interface CategoryData {
  id: string
  name: string
  description: string
  parentId: string | null
  createdAt: string
}

// Mock Data
const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    email: 'ahmad@example.com',
    role: 'manager',
    phones: [
      { label: 'Primary', number: '08123456789' },
      { label: 'Office', number: '021234567' },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti@example.com',
    role: 'user',
    phones: [{ label: 'Primary', number: '08987654321' }],
    createdAt: '2024-02-10',
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
    createdAt: '2024-01-20',
  },
]

const mockProducts: ProductData[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 15_000_000,
    categoryId: '1',
    stock: 25,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 250_000,
    categoryId: '2',
    stock: 150,
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub',
    price: 500_000,
    categoryId: '2',
    stock: 80,
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Monitor 27"',
    description: '4K UHD Monitor',
    price: 3_500_000,
    categoryId: '3',
    stock: 15,
    createdAt: '2024-01-18',
  },
]

const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Computers',
    description: 'Desktop and laptop computers',
    parentId: null,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Accessories',
    description: 'Computer accessories',
    parentId: null,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Peripherals',
    description: 'Input/Output devices',
    parentId: null,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Keyboards',
    description: 'Computer keyboards',
    parentId: '2',
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    name: 'Mice',
    description: 'Computer mice',
    parentId: '2',
    createdAt: '2024-01-05',
  },
]

// Utility to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// User API
export const userAPI = {
  getAll: async (): Promise<UserData[]> => {
    await delay(500)
    return [...mockUsers]
  },

  getById: async (id: string): Promise<UserData | null> => {
    await delay(300)
    const user = mockUsers.find(u => u.id === id)
    return user || null
  },

  create: async (
    data: Omit<UserData, 'id' | 'createdAt'>,
  ): Promise<UserData> => {
    await delay(800)
    const dateStr = new Date().toISOString().split('T')[0]
    const newUser: UserData = {
      ...data,
      id: String(Math.random()).slice(2),
      createdAt: dateStr || '2024-01-01',
    }
    mockUsers.push(newUser)
    return newUser
  },

  update: async (
    id: string,
    data: Partial<UserData>,
  ): Promise<UserData | null> => {
    await delay(800)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) {
      return null
    }
    const original = mockUsers[index]
    if (!original) {
      return null
    }
    const updated: UserData = {
      id: original.id,
      createdAt: original.createdAt,
      name: data.name ?? original.name,
      email: data.email ?? original.email,
      role: data.role ?? original.role,
      phones: data.phones ?? original.phones,
    }
    mockUsers[index] = updated
    return mockUsers[index]
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(500)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) {
      return false
    }
    mockUsers.splice(index, 1)
    return true
  },
}

// Product API
export const productAPI = {
  getAll: async (): Promise<ProductData[]> => {
    await delay(500)
    return [...mockProducts]
  },

  getById: async (id: string): Promise<ProductData | null> => {
    await delay(300)
    const product = mockProducts.find(p => p.id === id)
    return product || null
  },

  create: async (
    data: Omit<ProductData, 'id' | 'createdAt'>,
  ): Promise<ProductData> => {
    await delay(800)
    const dateStr = new Date().toISOString().split('T')[0]
    const newProduct: ProductData = {
      ...data,
      id: String(Math.random()).slice(2),
      createdAt: dateStr || '2024-01-01',
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  update: async (
    id: string,
    data: Partial<ProductData>,
  ): Promise<ProductData | null> => {
    await delay(800)
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) {
      return null
    }
    const original = mockProducts[index]
    if (!original) {
      return null
    }
    const updated: ProductData = {
      id: original.id,
      createdAt: original.createdAt,
      name: data.name ?? original.name,
      description: data.description ?? original.description,
      price: data.price ?? original.price,
      categoryId: data.categoryId ?? original.categoryId,
      stock: data.stock ?? original.stock,
    }
    mockProducts[index] = updated
    return mockProducts[index]
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(500)
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) {
      return false
    }
    mockProducts.splice(index, 1)
    return true
  },
}

// Category API
export const categoryAPI = {
  getAll: async (): Promise<CategoryData[]> => {
    await delay(500)
    return [...mockCategories]
  },

  getById: async (id: string): Promise<CategoryData | null> => {
    await delay(300)
    const category = mockCategories.find(c => c.id === id)
    return category || null
  },

  create: async (
    data: Omit<CategoryData, 'id' | 'createdAt'>,
  ): Promise<CategoryData> => {
    await delay(800)
    const dateStr = new Date().toISOString().split('T')[0]
    const newCategory: CategoryData = {
      ...data,
      id: String(Math.random()).slice(2),
      createdAt: dateStr || '2024-01-01',
    }
    mockCategories.push(newCategory)
    return newCategory
  },

  update: async (
    id: string,
    data: Partial<CategoryData>,
  ): Promise<CategoryData | null> => {
    await delay(800)
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) {
      return null
    }
    const original = mockCategories[index]
    if (!original) {
      return null
    }
    const updated: CategoryData = {
      id: original.id,
      createdAt: original.createdAt,
      name: data.name ?? original.name,
      description: data.description ?? original.description,
      parentId: data.parentId ?? original.parentId,
    }
    mockCategories[index] = updated
    return mockCategories[index]
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(500)
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) {
      return false
    }
    mockCategories.splice(index, 1)
    return true
  },
}

import { Role, OrderStatus } from '@prisma/client'

export type { Role, OrderStatus }

export interface User {
  id: string
  name: string
  email: string
  role: Role
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  content?: string | null
  usage?: string | null
  price: number
  salePrice?: number | null
  sku?: string | null
  stock: number
  images: string
  featured: boolean
  active: boolean
  categoryId: string
  category?: Category
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  quantity: number
  product: Product
  productId: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode?: string | null
  isDefault: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: Product
  productId: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  couponCode?: string | null
  notes?: string | null
  trackingNumber?: string | null
  userId: string
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  approved: boolean
  userId: string
  user: User
  productId: string
  product: Product
  createdAt: Date
  updatedAt: Date
}


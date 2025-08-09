export interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  minStock: number
}

export interface Sale {
  id: string
  productId: string
  quantity: number
  totalPrice: number
  date: string
  customerName?: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'entrada' | 'saida'
  quantity: number
  date: string
  reason: string
}
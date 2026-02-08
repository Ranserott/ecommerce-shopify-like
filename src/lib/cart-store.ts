import { create } from 'zustand'

export interface CartItem {
  id: string
  variantId: string
  productId: string
  productName: string
  variantName: string
  price: number
  quantity: number
  imageUrl: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.variantId === item.variantId)
    
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }
    } else {
      return {
        ...state,
        items: [...state.items, { ...item, id: crypto.randomUUID(), quantity: 1 }],
      }
    }
  }),

  removeItem: (id) => set((state) => ({
    ...state,
    items: state.items.filter((i) => i.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== id),
      }
    }

    return {
      ...state,
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    }
  }),

  clearCart: () => set({ items: [], isOpen: false }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))

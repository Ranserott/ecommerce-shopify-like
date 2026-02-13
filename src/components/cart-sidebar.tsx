'use client'

import { useCartStore } from '@/lib/cart-store'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrito</h2>
          </div>
          <button
            onClick={toggleCart}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm mt-2">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.variantName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.variantName}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold">${getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

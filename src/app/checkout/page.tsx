'use client'

import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingCart, CreditCard, Truck, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [processing, setProcessing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  // For demo, just use first cart item as product
  useEffect(() => {
    if (items.length > 0 && !selectedProduct) {
      // In real app, fetch full product data
      setSelectedProduct(items[0] as any)
      setSelectedVariant(items[0])
      setLoading(false)
    } else if (items.length === 0) {
      setLoading(false)
    }
  }, [items, selectedProduct])

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      // Stripe integration would go here
      alert(`Checkout: ${getTotal().toFixed(2)} - Stripe integration coming soon!`)
      clearCart()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b">
        <Link href="/products" className="text-lg font-semibold hover:underline">
          ← Volver a Productos
        </Link>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="text-sm">Checkout</span>
        </div>
      </nav>

      {/* Cart Summary */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold">Resumen de tu pedido</h1>

            {items.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-4">
                  Agrega productos para continuar con tu compra
                </p>
                <Link href="/products">
                  <Button className="w-full">
                    Ver Productos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border bg-card p-4 flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.variantName}
                      </p>
                      <p className="text-sm">
                        Cantidad: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Summary & Checkout */}
          <div className="space-y-4">
            {/* Cart Summary */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-xl font-bold">Resumen</h2>

              {items.length > 0 && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos (19%)</span>
                      <span>${(getTotal() * 0.19).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                      <span>Total</span>
                      <span>${(getTotal() * 1.19).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Shipping Info */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Envío
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  Envío gratis a todo el país
                </p>
                <p className="flex items-center gap-2">
                  <span>🚚</span>
                  5-7 días hábiles
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pago Seguro
              </h3>
              <p className="text-sm text-muted-foreground">
                Tu información de pago está protegida con cifrado SSL de 256 bits.
              </p>
            </div>

            {/* Checkout Button */}
            {items.length > 0 && (
              <Button
                onClick={handleCheckout}
                disabled={processing}
                size="lg"
                className="w-full"
              >
                {processing ? 'Procesando...' : 'Pagar con Stripe'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

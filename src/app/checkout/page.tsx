import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingCart, CreditCard, Truck } from 'lucide-react'
import Image from 'next/image'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
      images: {
        orderBy: { order: 'asc' }
      },
      category: true
    }
  })

  if (!product) return notFound()
  return product
}

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  const { items, getTotal, clearCart } = useCartStore()
  const [selectedVariant, setSelectedVariant] = React.useState(product.variants[0])
  const [quantity, setQuantity] = React.useState(1)
  const [processing, setProcessing] = React.useState(false)

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      // Aquí iría la integración con Stripe
      // Por ahora, solo limpiamos el carrito
      alert(`Checkout: ${getTotal().toFixed(2)} - Stripe integration coming soon!`)
      clearCart()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between p-4 border-b">
        <a href="/products" className="text-lg font-semibold hover:underline">
          ← Volver a Productos
        </a>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="text-sm">Checkout</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Details */}
          <div className="space-y-6">
            {product.images.length > 0 && (
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="aspect-square overflow-hidden rounded-md bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              {product.category && (
                <span className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full mb-3">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-medium">Variantes:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 text-left rounded-lg border-2 transition-colors ${
                        selectedVariant.id === variant.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(variant.price || product.price).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Cantidad:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <p className="text-sm text-muted-foreground">
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} en stock` : 'Agotado'}
            </p>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total:</span>
                <span className="text-2xl font-bold">
                  ${((Number(selectedVariant.price || product.price) * quantity)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Cart Summary */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Resumen del Pedido
              </h2>

              {items.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-muted-foreground text-xs">
                            {item.variantName} x {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span>${(getTotal() * 0.19).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${(getTotal() * 1.19).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  El carrito está vacío
                </p>
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

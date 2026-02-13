import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import { Minus, Plus, ShoppingCart, ArrowLeft, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
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

  return <ProductDetails product={product} />
}

function ProductDetails({ product }: { product: any }) {
  const { addItem, toggleCart } = useCartStore()
  const [selectedVariant, setSelectedVariant] = React.useState(product.variants[0])
  const [quantity, setQuantity] = React.useState(1)
  const [adding, setAdding] = React.useState(false)

  const handleAddToCart = () => {
    setAdding(true)
    try {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: selectedVariant.name,
        price: Number(selectedVariant.price || product.price),
        imageUrl: product.images[0]?.url || '',
      })
      toggleCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/products" className="text-xl font-semibold flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Productos
        </Link>
        <button
          onClick={toggleCart}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {product.images.length > 0 ? (
                <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    width={600}
                    height={600}
                    className="object-cover"
                    priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="aspect-square overflow-hidden rounded-md bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                4.8 (120 reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {selectedVariant && (
                <p className="text-3xl font-bold">
                  ${(Number(selectedVariant.price || product.price)).toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-muted-foreground">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Variantes:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        selectedVariant.id === variant.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {variant.stock > 0
                          ? `${variant.stock} disponibles`
                          : 'Agotado'
                        }
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Cantidad:</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="w-20 h-12 flex items-center justify-center border rounded-lg">
                  <span className="text-xl font-semibold">{quantity}</span>
                </div>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  disabled={quantity >= selectedVariant.stock}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {selectedVariant.stock > 10 ? (
                <span className="text-green-600 font-medium">✓ En stock</span>
              ) : selectedVariant.stock > 0 ? (
                <span className="text-yellow-600 font-medium">⚠ Solo {selectedVariant.stock} disponibles</span>
              ) : (
                <span className="text-red-600 font-medium">✕ Agotado</span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={adding || selectedVariant.stock <= 0}
                size="lg"
                className="w-full"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {adding ? 'Agregando...' : 'Agregar al Carrito'}
              </Button>

              <Link href="/checkout" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Ir al Checkout
                </Button>
              </Link>
            </div>

            {/* Delivery Info */}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <h3 className="font-semibold flex items-center gap-2">
                🚚 Envío
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Envío gratis a todo el país</p>
                <p>• 5-7 días hábiles</p>
                <p>• Devolución gratis dentro de 30 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

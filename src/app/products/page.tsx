import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ShoppingCart } from 'lucide-react'

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1
      },
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return products
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="text-2xl font-bold">
          Shopify
        </Link>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Tu tienda, tu marca
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            La plataforma de ecommerce completa para tu negocio
          </p>
          <Link href="/admin" className="inline-flex h-12 items-center justify-center rounded-lg bg-white text-blue-600 px-8 font-semibold shadow-lg hover:bg-blue-50 transition-colors">
            Comenzar Ahora
          </Link>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Catálogo</h2>
            <p className="text-muted-foreground">
              {products.length} productos disponibles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Carrito
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted mb-4">
                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingCart className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                {product.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full mb-2">
                    {product.category.name}
                  </span>
                )}
                {product.variants.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Desde <span className="font-semibold text-foreground">
                      ${product.variants[0].price.toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Link href={`/products/${product.slug}`} className="w-full">
                  <Button className="w-full">Ver Detalles</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

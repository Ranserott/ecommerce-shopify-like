import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
      images: {
        orderBy: { order: 'asc' }
      },
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return products
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/admin" className="text-xl font-bold">
          Shopify
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            Órdenes
          </Link>
          <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
            Productos
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Gestionar Productos</h1>
            <p className="text-muted-foreground mt-1">
              {products.length} productos en total
            </p>
          </div>
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24">
              <Package className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">No hay productos</h2>
              <p className="text-muted-foreground text-center mb-6">
                Crea tu primer producto para comenzar a vender
              </p>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Crear Producto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted mb-4">
                    {product.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  {product.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.category.name}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Variantes:</span>
                      <span className="font-medium">{product.variants.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precio base:</span>
                      <span className="font-medium">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.variants.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Desde:</span>
                        <span className="font-medium">
                          ${product.variants[0].price.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock total:</span>
                      <span className="font-medium">
                        {product.variants.reduce((sum, v) => sum + v.stock, 0)} unidades
                      </span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

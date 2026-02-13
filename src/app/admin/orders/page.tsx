import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function getOrders() {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true
            }
          }
        }
      },
      user: {
        select: { name: true, email: true }
      }
    }
  })

  return orders
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold hover:underline">
          <ArrowLeft className="h-5 w-5" />
          Admin
        </Link>
        <Button>Órdenes</Button>
      </nav>

      {/* Orders Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Órdenes</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle>No hay órdenes todavía</CardTitle>
              <CardDescription className="text-center">
                Las órdenes de los clientes aparecerán aquí
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Orden #{order.id.slice(-8).toUpperCase()}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4" />
                        {order.user?.name || order.user?.email || 'Invitado'}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      ${(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                  {order.items.length > 0 && (
                    <div className="text-sm mt-3">
                      <span className="text-muted-foreground">Items:</span>
                      <div className="mt-2 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-muted/50 rounded p-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {item.productVariant?.product?.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.productVariant?.name} x {item.quantity}
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              ${((item.price / 100) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

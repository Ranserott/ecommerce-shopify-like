import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ShoppingBag, Calendar, User, MoreVertical } from 'lucide-react'
import Link from 'next/link'

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      },
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    take: 50
  })

  return orders
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

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
          <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
            Productos
          </Link>
          <Link href="/admin/orders" className="text-sm font-medium">
            Órdenes
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Órdenes</h1>
            <p className="text-muted-foreground mt-1">
              {orders.length} órdenes en total
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver Tienda
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">No hay órdenes</h2>
              <p className="text-muted-foreground text-center">
                Las órdenes de los clientes aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div className="flex items-center gap-4">
                    <CardTitle>Orden #{order.id.slice(-8).toUpperCase()}</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'DELIVERED'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-medium">
                      {order.user?.name || order.user?.email || 'Invitado'}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-medium mb-2">Items ({order.items.length})</h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.variant?.product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.variant?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            {item.quantity} x ${(item.price / 100).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            = ${(item.quantity * item.price / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold">
                      ${(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

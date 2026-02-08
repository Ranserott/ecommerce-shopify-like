import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: { name: true, email: true }
        }
      }
    })
  ])

  return {
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="text-xl font-bold">
          Shopify
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
            Ver Tienda
          </Link>
          <Button size="sm">Admin</Button>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Órdenes
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ingresos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${(stats.totalRevenue / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ticket Promedio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${(stats.totalRevenue > 0 ? (stats.totalRevenue / stats.totalOrders / 100).toFixed(2) : '0.00')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Órdenes Recientes</h2>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
              Gestionar Productos →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
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
              {stats.recentOrders.map((order) => (
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
                      <div className="text-sm">
                        <span className="text-muted-foreground">Items:</span>
                        <span className="ml-2">
                          {order.items.map((item) => item.quantity).reduce((a, b) => a + b, 0)} productos
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

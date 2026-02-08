import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { CartSidebar } from '@/components/cart-sidebar'
import { useCartStore } from '@/lib/cart-store'

export const metadata: Metadata = {
  title: 'Shopify Ecommerce',
  description: 'Plataforma moderna de comercio electrónico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { items, toggleCart } = useCartStore()

  return (
    <html lang="es">
      <body className="min-h-screen bg-background">
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <Link href="/" className="text-2xl font-bold">
            Shopify
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Productos
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </nav>

        <CartSidebar />

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}

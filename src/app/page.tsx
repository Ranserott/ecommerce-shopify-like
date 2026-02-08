export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Shopify Ecommerce
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300">
            Plataforma moderna de comercio electrónico
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition-colors"
          >
            Ver Productos
          </a>
          <a
            href="/admin"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-8 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50 transition-colors"
          >
            Panel Admin
          </a>
        </div>

        <div className="space-y-4 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Construido con Next.js 15, Prisma, PostgreSQL, TailwindCSS y Zustand
          </p>
          <div className="flex justify-center gap-8 text-xs">
            <span>Next.js 15</span>
            <span>TypeScript</span>
            <span>Prisma ORM</span>
            <span>TailwindCSS</span>
          </div>
        </div>
      </div>
    </main>
  )
}

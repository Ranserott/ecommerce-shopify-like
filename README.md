# Ecommerce Shopify-Like

Ecommerce moderno construido con Next.js 14+ (App Router), Prisma, PostgreSQL, TailwindCSS, Zustand, NextAuth y Stripe.

## 🚀 Características

- ✅ Catálogo de productos con categorías
- ✅ Variantes de productos (talla, color, etc.)
- ✅ Carrito persistente (DB + localStorage)
- ✅ Checkout con Stripe
- ✅ Panel de administración básico
- ✅ SEO optimizado con metadata dinámica
- ✅ Server Actions + API Routes
- ✅ Arquitectura escalable

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15.1.6 (App Router, Server Components)
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL con Prisma ORM
- **Estilos:** TailwindCSS + shadcn/ui components
- **Estado carrito:** Zustand
- **Autenticación:** NextAuth v5 (Credentials)
- **Pagos:** Stripe Checkout

## 📋 Prerrequisitos

### 1. Node.js y npm
```bash
node --version  # v18+ recomendado
npm --version   # v9+ recomendado
```

### 2. PostgreSQL
**Opción A - Docker Desktop (Recomendado):**
```bash
# Instalar Docker Desktop para Mac/Windows
# Luego ejecutar en el directorio del proyecto:
docker compose up -d
```

**Opción B - PostgreSQL Local:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb ecommerce_db
```

**Opción C - Cloud (para producción):**
- Supabase (gratis para desarrollo)
- Neon Serverless Postgres
- Railway PostgreSQL

### 3. GitHub CLI (para deploy opcional)
```bash
# macOS
brew install gh

# Iniciar sesión
gh auth login
```

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo-url>
cd ecommerce-shopify-like
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_tu_clave_aqui"
STRIPE_WEBHOOK_SECRET="whsec_tu_clave_webhook"
```

4. **Ejecutar migraciones de Prisma**
```bash
npx prisma generate
npx prisma db push
```

5. **Cargar datos de prueba (opcional)**
```bash
npx tsx prisma/seed.ts
```

## 🏃 Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
ecommerce-shopify-like/
├── src/
│   ├── actions/          # Server Actions
│   ├── app/              # Next.js App Router
│   │   ├── admin/       # Panel de administración
│   │   ├── api/          # API Routes
│   │   ├── auth/         # NextAuth configuración
│   │   ├── products/     # Páginas de productos
│   │   └── cart/         # Páginas de carrito
│   ├── components/       # Componentes React
│   │   └── ui/          # shadcn/ui components
│   └── lib/              # Utilidades
├── prisma/              # Prisma schema y migraciones
│   └── public/            # Archivos estáticos
```

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:push` | Aplica cambios de schema a DB |
| `npm run db:migrate` | Crea y ejecuta migración |
| `npm run db:seed` | Carga datos de prueba |
| `npm run db:studio` | Abre Prisma Studio (UI de DB) |
| `npm run db:reset` | Resetea base de datos |

## 🔐 Usuarios de Prueba

Después de ejecutar el seed:

| Rol | Email | Contraseña |
|-----|--------|------------|
| Admin | admin@shopify.com | (hash - necesita bcrypt) |
| User | user@shopify.com | (hash - necesita bcrypt) |

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar tu repositorio a Vercel**
2. **Importar el proyecto**
3. **Configurar variables de entorno**
4. **Desplegar**

### Otras opciones
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 Notas de Desarrollo

### Arquitectura Decidida

- **Server Components por defecto** para mejor SEO y rendimiento
- **Client Components** solo cuando es necesario interactividad (carrito, formularios)
- **Server Actions** para mutaciones (agregar al carrito, crear órdenes)
- **Streaming** para páginas con carga progresiva

### Estado Carrito

- **DB** para usuarios logueados (persistente)
- **localStorage** para usuarios anónimos
- **Zustand** para estado global del cliente
- **Merge automático** cuando un usuario anónimo inicia sesión

### NextAuth Configuración

- **Credentials** para login con email/contraseña
- **JWT** para tokens de sesión
- **Prisma Adapter** para persistencia de sesión

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Construido con ❤️ usando Next.js y Prisma**

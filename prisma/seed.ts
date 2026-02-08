import { prisma } from '../src/lib/prisma'

async function main() {
  // Create categories
  const clothing = await prisma.category.upsert({
    where: { slug: 'ropa' },
    update: {},
    create: {
      name: 'Ropa',
      slug: 'ropa',
      description: 'Colección de ropa',
    }
  })

  const accessories = await prisma.category.upsert({
    where: { slug: 'accesorios' },
    update: {},
    create: {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Bolsos, cinturones, etc.',
    }
  })

  // Create products with variants and images
  const product1 = await prisma.product.create({
    data: {
      name: 'Camiseta Premium',
      slug: 'camiseta-premium',
      description: 'Camiseta de algodón de alta calidad, perfecta para el uso diario.',
      price: 29.99,
      categoryId: clothing.id,
      variants: {
        create: [
          {
            name: 'Negro / S',
            sku: 'CAM-PRE-NEG-S',
            price: 29.99,
            stock: 50,
          },
          {
            name: 'Negro / M',
            sku: 'CAM-PRE-NEG-M',
            price: 29.99,
            stock: 45,
          },
          {
            name: 'Blanco / S',
            sku: 'CAM-PRE-BLA-S',
            price: 29.99,
            stock: 30,
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9a17a7?w=500',
            alt: 'Camiseta negra',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9a17a7?w=500',
            alt: 'Camiseta vista detalle',
            order: 2,
          },
        ],
      },
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Bolso de Cuero',
      slug: 'bolso-cuero',
      description: 'Bolso de cuero genuino, con múltiples compartimentos y correa ajustable.',
      price: 149.99,
      categoryId: accessories.id,
      variants: {
        create: [
          {
            name: 'Natural',
            sku: 'BOL-CUE-NAT',
            price: 149.99,
            stock: 20,
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1548036328-c7fa1d3cfa2d?w=500',
            alt: 'Bolso cuero',
            order: 1,
          },
        ],
      },
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: 'Chaqueta Urbana',
      slug: 'chaqueta-urbana',
      description: 'Chaqueta estilo urbano, con diseño moderno y materiales resistentes.',
      price: 89.99,
      categoryId: accessories.id,
      variants: {
        create: [
          {
            name: 'Rojo',
            sku: 'CHA-URB-ROJ',
            price: 89.99,
            stock: 35,
          },
          {
            name: 'Negro',
            sku: 'CHA-URB-NEG',
            price: 89.99,
            stock: 28,
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a4?w=500',
            alt: 'Chaqueta roja',
            order: 1,
          },
        ],
      },
    },
  })

  // Create a test user
  await prisma.user.create({
    data: {
      email: 'admin@shopify.com',
      password: 'hashed_password_here',
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('- 3 productos creados')
  console.log('- 2 categorías creadas')
  console.log('- 1 usuario admin creado')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

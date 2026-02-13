import { prisma } from '@/lib/prisma'

export async function getCart(sessionId: string) {
  const carts = await prisma.cart.findMany({
    where: { sessionId },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })

  if (carts.length === 0) return null
  return carts[0]
}

export async function getOrCreateCart(sessionId: string) {
  let cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })
  }

  return cart
}

export async function addToCart(sessionId: string, productVariantId: string, quantity: number = 1) {
  const cart = await getOrCreateCart(sessionId)

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productVariantId
    }
  })

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } }
    })
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productVariantId,
      quantity
    }
  })
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return await prisma.cartItem.delete({
      where: { id: itemId }
    })
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  })
}

export async function removeFromCart(itemId: string) {
  return await prisma.cartItem.delete({
    where: { id: itemId }
  })
}

export async function clearCart(sessionId: string) {
  const cart = await getCart(sessionId)

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })
  }
}

export async function createOrder(userId: string, items: any[], total: number) {
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: 'PENDING',
      items: {
        create: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  })

  // Clear cart if we have cart info
  if (items.length > 0 && items[0]?.cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId: items[0]?.cartId }
    })
  }

  return order
}

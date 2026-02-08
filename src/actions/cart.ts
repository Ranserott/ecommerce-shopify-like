import { prisma } from '@/lib/prisma'

export async function getCart(sessionId: string) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })
  return cart
}

export async function addToCart(sessionId: string, variantId: string, quantity: number = 1) {
  let cart = await prisma.cart.findUnique({
    where: { sessionId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId }
    })
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId
    }
  })

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } }
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity
      }
    })
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: itemId }
    })
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })
  }
}

export async function removeFromCart(itemId: string) {
  await prisma.cartItem.delete({
    where: { id: itemId }
  })
}

export async function clearCart(sessionId: string) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId }
  })

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
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  })

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { cartId: items[0]?.cartId }
  })

  return order
}

import { prisma } from '../../prisma/prisma'
import { ActivateSubscriptionDto } from './subscriptions.schema'

export const getMySubscriptionService = async (restaurantId: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      id: true,
      name: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      subscriptionEndsAt: true,
      isBlocked: true,
      createdAt: true,
    },
  })

  if (!restaurant) {
    throw new Error('RESTAURANT_NOT_FOUND')
  }

  const now = new Date()

  let daysLeft: number | null = null

  if (restaurant.subscriptionStatus === 'TRIAL' && restaurant.trialEndsAt) {
    daysLeft = Math.ceil((restaurant.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (restaurant.subscriptionStatus === 'ACTIVE' && restaurant.subscriptionEndsAt) {
    daysLeft = Math.ceil(
      (restaurant.subscriptionEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    )
  }

  return {
    ...restaurant,
    daysLeft,
  }
}

const addMonths = (date: Date, months: number) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const activateSubscriptionService = async (
  restaurantId: string,
  dto: ActivateSubscriptionDto,
) => {
  const now = new Date()

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  })

  if (!restaurant) {
    throw new Error('Restaurant not found')
  }

  const baseDate =
    restaurant.subscriptionEndsAt && restaurant.subscriptionEndsAt > now
      ? restaurant.subscriptionEndsAt
      : now

  const newSubscriptionEndsAt = addMonths(baseDate, dto.months)

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.subscriptionPayment.create({
      data: {
        amount: dto.amount,
        months: dto.months,
        provider: dto.provider,
        status: 'PAID',
        paidAt: now,
        comment: dto.comment,
        restaurantId,
        planId: dto.planId,
      },
    })

    const updatedRestaurant = await tx.restaurant.update({
      where: { id: restaurantId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt: newSubscriptionEndsAt,
        isBlocked: false,
      },
    })

    return {
      restaurant: updatedRestaurant,
      payment,
    }
  })

  return result
}

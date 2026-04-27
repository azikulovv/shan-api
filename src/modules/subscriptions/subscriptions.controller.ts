import type { NextFunction, Request, Response } from 'express'
import type { AuthRequest } from '../../shared/middlewares/auth.middleware'
import { activateSubscriptionService, getMySubscriptionService } from './subscriptions.service'

export const getMySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getMySubscriptionService(req.user!.restaurantId)

    return res.json({
      message: 'Subscription info',
      data,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'RESTAURANT_NOT_FOUND') {
      return res.status(404).json({
        message: 'Restaurant not found',
      })
    }

    return res.status(500).json({
      message: 'Internal error',
    })
  }
}

export const activateSubscriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId } = req.params

    if (!restaurantId) {
      return res.status(404).json({
        message: 'restaurantId not found',
      })
    }

    const result = await activateSubscriptionService(String(restaurantId), {
      planId: req.body.planId,
      amount: req.body.amount,
      months: req.body.months,
      provider: req.body.provider,
      comment: req.body.comment,
    })

    res.status(200).json({
      message: 'Subscription activated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

import { Router } from 'express'
import { activateSubscriptionController, getMySubscription } from './subscriptions.controller'
import { authMiddleware, requireRole } from '../../shared/middlewares/auth.middleware'
import { systemAuthMiddleware } from '../../shared/middlewares/system-admin.middleware'

export const subscriptionsRoutes = Router()

subscriptionsRoutes.get('/', authMiddleware, requireRole('OWNER', 'ADMIN'), getMySubscription)
subscriptionsRoutes.post(
  '/:restaurantId/activate',
  systemAuthMiddleware,
  activateSubscriptionController,
)

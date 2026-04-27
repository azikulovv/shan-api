import type { Logger } from 'pino'

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string
        restaurantId: string
        role: 'OWNER' | 'ADMIN'
      }
      log: Logger
      systemUser?: {
        id: string
        role: 'SYSTEM_ADMIN'
      }
    }
  }
}

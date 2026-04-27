import type { Logger } from 'pino'

declare namespace Express {
  export interface Request {
    user?: {
      userId: string
      restaurantId: string
      role: 'OWNER' | 'ADMIN'
    }
    log: Logger
  }
}

import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

type SystemJwtPayload = {
  systemUserId: string
  role: 'SYSTEM_ADMIN'
  type: 'SYSTEM'
}

export const systemAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.SHANYRAQ_JWT_SECRET_KEY!) as SystemJwtPayload

    if (payload.type !== 'SYSTEM' || payload.role !== 'SYSTEM_ADMIN') {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    req.systemUser = {
      id: payload.systemUserId,
      role: payload.role,
    }

    next()
  } catch {
    return res.status(401).json({
      message: 'Invalid token',
    })
  }
}

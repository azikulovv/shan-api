import type { Request, Response } from 'express'
import { systemLoginService } from './system-auth.service'

export const systemLoginController = async (req: Request, res: Response) => {
  try {
    const data = await systemLoginService({
      email: req.body.email,
      password: req.body.password,
    })

    res.json({
      message: 'Login success',
      data,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    res.status(500).json({
      message: 'Internal error',
    })
  }
}

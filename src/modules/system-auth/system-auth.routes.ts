import { Router } from 'express'
import { validateBody } from '../../shared/middlewares/validate-body'
import { systemLoginSchema } from './system-auth.schema'
import { systemLoginController } from './system-auth.controller'

export const systemAuthRoutes = Router()

systemAuthRoutes.post('/login', validateBody(systemLoginSchema), systemLoginController)

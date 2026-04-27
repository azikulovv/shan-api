import bcrypt from 'bcrypt'
import { prisma } from '../../prisma/prisma'
import { signToken } from '../../shared/utils/jwt'
import type { SystemLoginDto } from './system-auth.schema'

export const systemLoginService = async (dto: SystemLoginDto) => {
  const systemUser = await prisma.systemUser.findUnique({
    where: {
      email: dto.email,
    },
  })

  if (!systemUser) {
    throw new Error('Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(dto.password, systemUser.passwordHash)

  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  const token = signToken({
    systemUserId: systemUser.id,
    role: 'SYSTEM_ADMIN',
    type: 'SYSTEM',
  })

  return {
    token,
    user: {
      id: systemUser.id,
      name: systemUser.name,
      email: systemUser.email,
      role: 'SYSTEM_ADMIN',
    },
  }
}

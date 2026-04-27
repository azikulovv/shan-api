import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.SHANYRAQ_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('SHANYRAQ_DATABASE_URL or DATABASE_URL is required for Prisma connection')
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({
  adapter,
})

const main = async () => {
  const name = process.env.SHANYRAQ_SYSTEM_NAME
  const email = process.env.SHANYRAQ_SYSTEM_EMAIL
  const password = process.env.SHANYRAQ_SYSTEM_PASSWORD

  if (!name) {
    throw new Error('SHANYRAQ_SYSTEM_NAME is required')
  }

  if (!email) {
    throw new Error('SHANYRAQ_SYSTEM_EMAIL is required')
  }

  if (!password) {
    throw new Error('SHANYRAQ_SYSTEM_PASSWORD is required')
  }

  if (password.length < 8) {
    throw new Error('SHANYRAQ_SYSTEM_PASSWORD must be at least 8 characters')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const systemUser = await prisma.systemUser.upsert({
    where: {
      email,
    },
    update: {
      name,
      passwordHash,
    },
    create: {
      name,
      email,
      passwordHash,
    },
  })

  console.log('System user is ready:', {
    id: systemUser.id,
    name: systemUser.name,
    email: systemUser.email,
  })
}

main()
  .catch((error) => {
    console.error('Failed to seed system user:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

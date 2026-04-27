import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.SHANYRAQ_DATABASE_URL

if (!connectionString) {
  throw new Error('SHANYRAQ_DATABASE_URL is not defined')
}

const adapter = new PrismaPg({
  connectionString,
})

export const prisma = new PrismaClient({
  adapter,
})

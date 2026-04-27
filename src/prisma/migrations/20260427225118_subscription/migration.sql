/*
  Warnings:

  - Changed the type of `status` on the `SubscriptionPayment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `provider` to the `SubscriptionPayment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionPaymentProvider" AS ENUM ('CASH', 'KASPI_TRANSFER', 'BANK_TRANSFER', 'ONLINE', 'MANUAL');

-- AlterTable
ALTER TABLE "SubscriptionPayment" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "months" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionPaymentStatus" NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "SubscriptionPaymentProvider" NOT NULL;

-- CreateTable
CREATE TABLE "SystemUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_email_key" ON "SystemUser"("email");

/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `order_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('BEING_PROCESSED', 'IS_CANCELLED', 'BEING_DELIVERED', 'IS_RECEIVED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'BEING_PROCESSED';

-- CreateIndex
CREATE UNIQUE INDEX "order_details_orderId_key" ON "order_details"("orderId");

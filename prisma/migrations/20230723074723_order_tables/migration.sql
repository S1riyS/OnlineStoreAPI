/*
  Warnings:

  - You are about to drop the `ItemAdditionalProps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `additional_features` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemAdditionalProps" DROP CONSTRAINT "ItemAdditionalProps_additionalPropId_fkey";

-- DropForeignKey
ALTER TABLE "ItemAdditionalProps" DROP CONSTRAINT "ItemAdditionalProps_itemId_fkey";

-- DropForeignKey
ALTER TABLE "additional_features" DROP CONSTRAINT "additional_features_categoryId_fkey";

-- DropTable
DROP TABLE "ItemAdditionalProps";

-- DropTable
DROP TABLE "additional_features";

-- CreateTable
CREATE TABLE "additional_props" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "additional_props_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_additional_props" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "additionalPropId" INTEGER NOT NULL,

    CONSTRAINT "item_additional_props_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryPrice" INTEGER NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "additional_props" ADD CONSTRAINT "additional_props_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_additional_props" ADD CONSTRAINT "item_additional_props_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_additional_props" ADD CONSTRAINT "item_additional_props_additionalPropId_fkey" FOREIGN KEY ("additionalPropId") REFERENCES "additional_props"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

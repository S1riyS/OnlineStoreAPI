/*
  Warnings:

  - You are about to drop the column `deliveryDate` on the `order_details` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryPrice` on the `order_details` table. All the data in the column will be lost.
  - Added the required column `counter` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_details" DROP COLUMN "deliveryDate",
DROP COLUMN "deliveryPrice";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "counter" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

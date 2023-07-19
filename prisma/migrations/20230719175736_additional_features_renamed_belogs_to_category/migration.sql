/*
  Warnings:

  - You are about to drop the column `itemId` on the `additional_features` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `additional_features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "additional_features" DROP CONSTRAINT "additional_features_itemId_fkey";

-- AlterTable
ALTER TABLE "additional_features" DROP COLUMN "itemId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "additional_features" ADD CONSTRAINT "additional_features_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

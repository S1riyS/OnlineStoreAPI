/*
  Warnings:

  - You are about to drop the column `value` on the `additional_features` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "additional_features" DROP COLUMN "value";

-- CreateTable
CREATE TABLE "ItemAdditionalProps" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "additionalPropId" INTEGER NOT NULL,

    CONSTRAINT "ItemAdditionalProps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemAdditionalProps" ADD CONSTRAINT "ItemAdditionalProps_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAdditionalProps" ADD CONSTRAINT "ItemAdditionalProps_additionalPropId_fkey" FOREIGN KEY ("additionalPropId") REFERENCES "additional_features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

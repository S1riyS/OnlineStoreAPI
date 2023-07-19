/*
  Warnings:

  - Added the required column `slug` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "slug" TEXT NOT NULL;

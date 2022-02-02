/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CoffeeShop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CoffeeShop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CoffeeShop" DROP CONSTRAINT "CoffeeShop_userId_fkey";

-- DropForeignKey
ALTER TABLE "CoffeeShopPhoto" DROP CONSTRAINT "CoffeeShopPhoto_coffeeShopId_fkey";

-- AlterTable
ALTER TABLE "CoffeeShop" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShop_slug_key" ON "CoffeeShop"("slug");

-- AddForeignKey
ALTER TABLE "CoffeeShopPhoto" ADD CONSTRAINT "CoffeeShopPhoto_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeShop" ADD CONSTRAINT "CoffeeShop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

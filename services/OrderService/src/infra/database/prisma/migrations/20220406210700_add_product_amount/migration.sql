/*
  Warnings:

  - You are about to drop the column `amount` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "amount";

-- CreateTable
CREATE TABLE "productAmount" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "ordersId" TEXT NOT NULL,

    CONSTRAINT "productAmount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productAmount" ADD CONSTRAINT "productAmount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productAmount" ADD CONSTRAINT "productAmount_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `pricePerNight` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `image` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "pricePerNight";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

/*
  Warnings:

  - Added the required column `roomType` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'TWIN', 'SUITE', 'FAMILY');

-- DropIndex
DROP INDEX "Room_hotelId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "roomId" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomType" "RoomType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[renavam]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chassis]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "chassis" TEXT,
ADD COLUMN     "fuel" TEXT,
ADD COLUMN     "modelYear" INTEGER,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "renavam" TEXT,
ADD COLUMN     "vehicleType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_renavam_key" ON "Vehicle"("renavam");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_chassis_key" ON "Vehicle"("chassis");

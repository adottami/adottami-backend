/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Characteristic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Characteristic_name_key" ON "Characteristic"("name");

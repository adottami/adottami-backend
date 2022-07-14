/*
  Warnings:

  - You are about to drop the `Characterist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Characterist" DROP CONSTRAINT "Characterist_publicationId_fkey";

-- DropTable
DROP TABLE "Characterist";

-- CreateTable
CREATE TABLE "Characteristic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacteristicToPublication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacteristicToPublication_AB_unique" ON "_CharacteristicToPublication"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacteristicToPublication_B_index" ON "_CharacteristicToPublication"("B");

-- AddForeignKey
ALTER TABLE "_CharacteristicToPublication" ADD CONSTRAINT "_CharacteristicToPublication_A_fkey" FOREIGN KEY ("A") REFERENCES "Characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacteristicToPublication" ADD CONSTRAINT "_CharacteristicToPublication_B_fkey" FOREIGN KEY ("B") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

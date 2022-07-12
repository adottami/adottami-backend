/*
  Warnings:

  - You are about to drop the `CharacteristicsOnPublications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharacteristicsOnPublications" DROP CONSTRAINT "CharacteristicsOnPublications_characteristicId_fkey";

-- DropForeignKey
ALTER TABLE "CharacteristicsOnPublications" DROP CONSTRAINT "CharacteristicsOnPublications_publicationId_fkey";

-- DropTable
DROP TABLE "CharacteristicsOnPublications";

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

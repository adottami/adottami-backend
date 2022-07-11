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
CREATE TABLE "CharacteristicsOnPublications" (
    "publicationId" TEXT NOT NULL,
    "characteristicId" TEXT NOT NULL,

    CONSTRAINT "CharacteristicsOnPublications_pkey" PRIMARY KEY ("publicationId","characteristicId")
);

-- AddForeignKey
ALTER TABLE "CharacteristicsOnPublications" ADD CONSTRAINT "CharacteristicsOnPublications_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicsOnPublications" ADD CONSTRAINT "CharacteristicsOnPublications_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

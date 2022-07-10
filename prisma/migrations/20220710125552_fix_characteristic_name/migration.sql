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
    "publicationId" TEXT NOT NULL,

    CONSTRAINT "Characteristic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Characteristic" ADD CONSTRAINT "Characteristic_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_publicationId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

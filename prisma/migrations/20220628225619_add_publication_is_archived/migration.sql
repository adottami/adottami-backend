/*
  Warnings:

  - Added the required column `isArchived` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "isArchived" BOOLEAN NOT NULL;

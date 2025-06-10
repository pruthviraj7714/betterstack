/*
  Warnings:

  - You are about to drop the column `name` on the `Website` table. All the data in the column will be lost.
  - Added the required column `url` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" DROP COLUMN "name",
ADD COLUMN     "url" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `url` on the `Check` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Check" DROP COLUMN "url";

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

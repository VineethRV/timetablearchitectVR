/*
  Warnings:

  - You are about to drop the column `block` on the `Section` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "block",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

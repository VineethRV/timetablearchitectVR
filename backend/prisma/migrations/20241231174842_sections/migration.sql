/*
  Warnings:

  - You are about to drop the column `Block` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `Courses` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `Elective` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `Lab` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `Rooms` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `Teachers` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `TimeTable` on the `Section` table. All the data in the column will be lost.
  - Added the required column `block` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTable` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "Block",
DROP COLUMN "Courses",
DROP COLUMN "Elective",
DROP COLUMN "Lab",
DROP COLUMN "Rooms",
DROP COLUMN "Teachers",
DROP COLUMN "TimeTable",
ADD COLUMN     "block" TEXT NOT NULL,
ADD COLUMN     "courses" TEXT[],
ADD COLUMN     "elective" TEXT,
ADD COLUMN     "lab" TEXT,
ADD COLUMN     "rooms" TEXT[],
ADD COLUMN     "semester" INTEGER,
ADD COLUMN     "teachers" TEXT[],
ADD COLUMN     "timeTable" TEXT NOT NULL;

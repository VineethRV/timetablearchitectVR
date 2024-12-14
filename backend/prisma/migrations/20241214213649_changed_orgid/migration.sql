/*
  Warnings:

  - You are about to drop the column `organisation` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `Elective` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `Lab` table. All the data in the column will be lost.
  - You are about to drop the column `dept` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `deptsList` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `hasAccess` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `organisationCode` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `students` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `teachers` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Elective` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depts_list` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_sections` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_students` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_teachers` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_name_department_organisation_key";

-- DropIndex
DROP INDEX "Teacher_name_department_organisation_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Elective" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lab" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "dept",
DROP COLUMN "deptsList",
DROP COLUMN "designation",
DROP COLUMN "hasAccess",
DROP COLUMN "organisationCode",
DROP COLUMN "sections",
DROP COLUMN "students",
DROP COLUMN "teachers",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "depts_list" TEXT NOT NULL,
ADD COLUMN     "invite_code" TEXT,
ADD COLUMN     "no_of_sections" INTEGER NOT NULL,
ADD COLUMN     "no_of_students" INTEGER NOT NULL,
ADD COLUMN     "no_of_teachers" INTEGER NOT NULL,
ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organisation",
ADD COLUMN     "orgId" INTEGER;

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_ownerId_key" ON "Organisation"("ownerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab" ADD CONSTRAINT "Lab_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elective" ADD CONSTRAINT "Elective_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

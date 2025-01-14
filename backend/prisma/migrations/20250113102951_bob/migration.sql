/*
  Warnings:

  - You are about to drop the column `alternateDepartments` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "alternateDepartments";

-- CreateTable
CREATE TABLE "Departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" INTEGER,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_deparmentTeachers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_deparmentTeachers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_deparmentTeachers_B_index" ON "_deparmentTeachers"("B");

-- AddForeignKey
ALTER TABLE "_deparmentTeachers" ADD CONSTRAINT "_deparmentTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_deparmentTeachers" ADD CONSTRAINT "_deparmentTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

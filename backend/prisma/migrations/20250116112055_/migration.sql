/*
  Warnings:

  - A unique constraint covering the columns `[name,orgId]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_orgId_key" ON "Departments"("name", "orgId");

-- CreateTable
CREATE TABLE "tempSection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER,
    "orgId" INTEGER NOT NULL,
    "department" TEXT,
    "teacherCourse" TEXT NOT NULL,

    CONSTRAINT "tempSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tempSection_name_orgId_semester_department_key" ON "tempSection"("name", "orgId", "semester", "department");

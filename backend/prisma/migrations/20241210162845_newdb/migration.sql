-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPass" TEXT NOT NULL,
    "organisation" TEXT,
    "role" TEXT,
    "hasAccess" BOOLEAN NOT NULL,
    "department" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organisation" TEXT,
    "department" TEXT,
    "lab" BOOLEAN,
    "timetable" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT,
    "email" TEXT,
    "department" TEXT,
    "alternateDepartments" TEXT,
    "timetable" TEXT,
    "labtable" TEXT,
    "organisation" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "department" TEXT,
    "organisation" TEXT,
    "semester" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "organisation" TEXT,
    "semester" INTEGER,
    "batches" TEXT,
    "teachers" TEXT,
    "rooms" TEXT,
    "timetable" TEXT,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elective" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "courses" TEXT,
    "teachers" TEXT,
    "rooms" TEXT,
    "semester" INTEGER,
    "organisation" TEXT,
    "timetable" TEXT,

    CONSTRAINT "Elective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_department_organisation_key" ON "Room"("name", "department", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_name_department_organisation_key" ON "Teacher"("name", "department", "organisation");

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "Courses" TEXT[],
    "Teachers" TEXT[],
    "Rooms" TEXT[],
    "Elective" TEXT,
    "Lab" TEXT,
    "defaultRoom" TEXT,
    "Block" TEXT NOT NULL,
    "TimeTable" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

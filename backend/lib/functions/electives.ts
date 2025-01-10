import { Teacher,Room } from "../types/main";
import { scoreRooms, scoreTeachers } from "./common";
import PrismaClientManager from "../pgConnect";


export const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const timeslots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30",
];

const prisma = PrismaClientManager.getInstance().getPrismaClient();

export async function getIntersection(teachers: string[], rooms: string[]): Promise<{status:number,intersection:number[][]}> {
  try{
      const teacherObjects = await prisma.teacher.findMany({
      where: {
        name: { in: teachers },
      },
      select: {
        timetable: true,
        labtable: true,
      }
    });
    const intersection: number[][] = weekdays.map(() => timeslots.map(() => 0));
    
    teacherObjects.map((teacher) => {
      const teacherScore: number[][] = scoreTeachers(
        teacher.timetable,
        teacher.labtable
      );
      intersection.map((row, i) => {
        row.map((value, j) => {
          if (teacherScore[i][j] < 0 || value < 0) return -1;
          return value + teacherScore[i][j];
        });
      });
    });
    const roomObjects = await prisma.room.findMany({
      where: {
        name: { in: rooms },
      },
      select: {
        timetable: true,
      }
    });
    roomObjects.map((room) => {
      const roomScore: number[][] = scoreRooms(room.timetable);
      intersection.map((row, i) =>
        row.map((value, j) => (roomScore[i][j] < 0 ? -1 : value))
      );
    });
    return {intersection: intersection,status:200};
  }
  catch(err){
    return {intersection:[],status:500};
  }
}
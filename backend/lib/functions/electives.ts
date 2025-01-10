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
      for(let i=0;i<6;i++){
        for(let j=0;j<6;j++){
          if(teacherScore[i][j]<0){
            intersection[i][j] = -1;
          }
          else if(intersection[i][j] >= 0){
            intersection[i][j] += teacherScore[i][j];
          }
        }
      }
    });
    console.log(teacherObjects);
    console.log("intersection: ",intersection);
    const roomObjects = await prisma.room.findMany({
      where: {
        name: { in: rooms },
      },
      select: {
        timetable: true,
      }
    });
    console.log(roomObjects);
    roomObjects.map((room) => {
      const roomScore: number[][] = scoreRooms(room.timetable);
      for(let i=0;i<6;i++){
        for(let j=0;j<6;j++){
          if(roomScore[i][j]<0){
            intersection[i][j] = -1;
          }
        }
      }
    });
    console.log("intersection: ",intersection);
    return {intersection: intersection,status:200};
  }
  catch(err){
    return {intersection:[],status:500};
  }
}
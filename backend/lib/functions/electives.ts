import { Teacher,Room } from "../types/main";
import { scoreRooms, scoreTeachers } from "./common";


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


export function getIntersection(teachers: Teacher[], rooms: Room[]): number[][] {
    const intersection: number[][] = weekdays.map(() => timeslots.map(() => 0));
  
    teachers.map((teacher) => {
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
  
    rooms.map((room) => {
      const roomScore: number[][] = scoreRooms(room.timetable);
      intersection.map((row, i) =>
        row.map((value, j) => (roomScore[i][j] < 0 ? -1 : value))
      );
    });
  
    return intersection;
  }
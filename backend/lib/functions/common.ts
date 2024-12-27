import { Teacher,Room } from "../types/main";

let freeFactor:number=0.1 //higher the number more continuous allocation is discouraged

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

export function convertStringToTable(timetableString: string|null): string[][] {
    if(timetableString)
        return timetableString.split(";").map((row) => row.split(","));
    else
        return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0".split(";").map((row) => row.split(","));
}
export function convertTableToString(timetable: string[][]|null): string {
    if(timetable)
        return timetable.map((row) => row.join(",")).join(";");
    return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0"
}

export function scoreTeachers(teacherTab:string|null,teacherLab:string|null):number[][] {
    let scoredTable: number[][] = [];
    let teacherTable=convertStringToTable(teacherTab)
    let teacherLabTT=convertStringToTable(teacherLab)
    for (let i = 0; i < teacherLabTT.length; i++) {
        for (let j = 0; j < teacherLabTT[i].length; j++) {
            if (teacherLabTT[i][j] !== "0") {
                teacherTable[i][j] = teacherLabTT[i][j];
            }
        }
    }
    for(let i=0;i<teacherTable.length;i++){
        let arr:number[]=[]
        for(let i=0;i<teacherTable.length;i++){
            arr.push(100)
        }
        scoredTable[i]=arr
        for(let j=0;j<teacherTable[i].length;j++){
            if(teacherTable[i][j]!="0"){
                scoredTable[i][j]=-1
                for(let k=0;k<j;k++){
                    scoredTable[i][k]=scoredTable[i][k]*((1-freeFactor)**(teacherTable[i].length-(j-k)))
                }
                for(let k=j+1;k<teacherTable[i].length;k++){
                    scoredTable[i][k]=scoredTable[i][k]*((1-freeFactor)**(teacherTable[i].length-(k-j)))
                }
            }
        }
    }
    return scoredTable;
}


export function scoreRooms(roomTab: string|null): number[][] {
    let scoredTable: number[][] = [];
    let roomTable = convertStringToTable(roomTab);
    for (let i = 0; i < roomTable.length; i++) {
        let arr: number[] = [];
        for (let j = 0; j < roomTable[i].length; j++) {
            if (roomTable[i][j] !== "0") {
                arr.push(-1);
            } else {
                arr.push(0);
            }
        }
        scoredTable.push(arr);
    }
    
    return scoredTable;
}

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
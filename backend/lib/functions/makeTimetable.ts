import { peekCourse } from "../actions/course";
import { PrismaClient } from "@prisma/client";
import * as auth from "../actions/auth";
import { getRooms, peekRoom } from "../actions/room";
import { peekTeacher, updateTeachers } from "../actions/teacher";
import { statusCodes } from "../types/statusCodes";
import { convertStringToTable, convertTableToString, scoreRooms, scoreTeachers } from "./common";
import { Section } from "../types/main";
const prisma = new PrismaClient();

// add one more dimemtion of rooms in return val toadd handling of subjects if the room is not specified explicitly
//test all functions, add handling of rooms to admins,
//collision handling
//current function is for non admins.
let randomFactor=0.1;//introduces some randomness in the allocation of courses to the timetable
type returnStrcture={
    timetable:string[][]|null,
    roomtable:string[][]|null
}
export async function suggestTimetable(
    token: string,
    block: string,
    courses: string[],
    teachers: string[],
    rooms: string[],
    semester: number,
    preferredRooms: string|null,
): Promise<{status:number,returnVal:returnStrcture|null}> {
    let errMessage = "";
    try {
        console.log("Converting block string to table");
        errMessage = "error while converting block string to table";
        const blocks = convertStringToTable(block);
        const timetable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? cell : '0'));
        const roomtable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? '-' : '0'));

        console.log("Fetching department rooms");
        errMessage = "error while fetching department rooms";
        const departmentRoomsResponse = await getRooms(token);
        if (departmentRoomsResponse.status !== statusCodes.OK || !departmentRoomsResponse.rooms) {
            return { status: departmentRoomsResponse.status, returnVal: { timetable: [[errMessage]], roomtable: null } };
        }

        let flag = 0;
        const roomsInfo = await Promise.all(departmentRoomsResponse.rooms.map(async (room) => {
            const roomResponse = await peekRoom(token, room.name);
            if (roomResponse.status !== statusCodes.OK || !roomResponse.room) {
                flag = 1;
            }
            return roomResponse.room;
        }));
        if (flag == 1) {
            return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } };
        }

        let bFactor = Array(6).fill(1);

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const teacher = teachers[i];

            console.log(`Fetching course details for course: ${course}`);
            errMessage = "error while fetching course details";
            const courseResponse = await peekCourse(token, course, semester);
            if (courseResponse.status !== statusCodes.OK || !courseResponse.course) {
                return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } };
            }

            console.log(`Fetching teacher details for teacher: ${teacher}`);
            errMessage = "error while fetching teacher details";
            const teacherResponse = await peekTeacher(token, teacher);
            if (teacherResponse.status !== statusCodes.OK || !teacherResponse.teacher) {
                return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } };
            }

            let bestScore = scoreTeachers(teacherResponse.teacher.timetable, teacherResponse.teacher.labtable);
            let currRoomInfo = null;
            errMessage="failed to create Preferred room"
            if (!preferredRooms) {
                let maxNonNegativeEntries = -1;
                for (const roomInfo of roomsInfo) {
                    if (roomInfo) {
                        const roomScore = scoreRooms(roomInfo.timetable);
                        let nonNegativeEntries = 0;
                        for (let i = 0; i < roomScore.length; i++) {
                            for (let j = 0; j < roomScore[i].length; j++) {
                                if (roomScore[i][j] >= 0) {
                                    nonNegativeEntries++;
                                }
                            }
                        }
                        if (nonNegativeEntries > maxNonNegativeEntries) {
                            maxNonNegativeEntries = nonNegativeEntries;
                            preferredRooms = roomInfo.name;
                        }
                    }
                }
            }
            errMessage="failed to allocate room"
            if (roomsInfo && rooms[i] != '0') {
                currRoomInfo = roomsInfo.find(room => room?.name === rooms[i]);
                if (!currRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } };
                }

                let feasible = scoreRooms(currRoomInfo.timetable);
                for (let i = 0; i < feasible.length; i++) {
                    for (let j = 0; j < feasible[i].length; j++) {
                        if (feasible[i][j] < 0) {
                            bestScore[i][j] = -1;
                        }
                    }
                }

                let availableSlots = 0;
                for (let i = 0; i < bestScore.length; i++) {
                    if (bestScore[i].some(score => score > 0)) {
                        availableSlots++;
                    }
                }

                if (courseResponse.course?.credits) {
                    for (let i = 0; i < bestScore.length; i++) {
                        for (let j = 0; j < bestScore[i].length; j++) {
                            if (bestScore[i][j] > 0) {
                                bestScore[i][j] = (bestScore[i][j] + randomFactor * Math.random()) / bFactor[i];
                            }
                        }
                    }

                    for (let k = 0; k < Math.min(courseResponse.course.credits, availableSlots); k++) {
                        const sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                            .sort((a, b) => b.score - a.score);
                        const { index } = sortedScores[k];
                        const row = Math.floor(index / bestScore[0].length);
                        const col = index % bestScore[0].length;
                        timetable[row][col] = courseResponse.course.name;
                        roomtable[row][col] = currRoomInfo.name;
                        bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                        for (let j = 0; j < bestScore[i].length; j++) {
                            bestScore[row][j] = -1;
                        }
                    }

                    if (availableSlots < courseResponse.course?.credits) {
                        return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: roomtable } };
                    }
                } else {
                    return { status: statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } };
                }
            } else {
                let bestScoreCopy = bestScore;
                const preferredRoomInfo = roomsInfo.find(room => room?.name === preferredRooms);
                if (!preferredRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } };
                }

                let feasible = scoreRooms(preferredRoomInfo.timetable);
                for (let i = 0; i < feasible.length; i++) {
                    for (let j = 0; j < feasible[i].length; j++) {
                        if (feasible[i][j] < 0) {
                            bestScore[i][j] = -1;
                        }
                    }
                }

                for (let i = 0; i < timetable.length; i++) {
                    for (let j = 0; j < timetable[i].length; j++) {
                        if (timetable[i][j] !== '0') {
                            bestScore[i][j] = -1;
                            bestScoreCopy[i][j] = -1;
                        }
                    }
                }

                let availableSlots = 0;
                for (let i = 0; i < bestScore.length; i++) {
                    if (bestScore[i].some(score => score > 0)) {
                        availableSlots++;
                    }
                }

                if (courseResponse.course?.credits) {
                    if (availableSlots < courseResponse.course?.credits) {
                        for (let k = 0; k < availableSlots; k++) {
                            let sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                                .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = preferredRoomInfo.name;
                            for (let i = 0; i < bestScoreCopy[row].length; i++) {
                                bestScoreCopy[row][i] = -1;
                            }
                        }

                        let remainingCredits = courseResponse.course.credits - availableSlots;

                        for (const roomInfo of roomsInfo) {
                            if (remainingCredits <= 0) break;
                            if (roomInfo && roomInfo.name !== preferredRoomInfo.name) {
                                let feasible = scoreRooms(roomInfo.timetable);
                                let bestScoreCopyCopy = bestScoreCopy;
                                for (let i = 0; i < feasible.length; i++) {
                                    for (let j = 0; j < feasible[i].length; j++) {
                                        if (feasible[i][j] < 0) {
                                            bestScoreCopyCopy[i][j] = -1;
                                        }
                                    }
                                }

                                let availableSlots = 0;
                                for (let i = 0; i < bestScore.length; i++) {
                                    if (bestScoreCopyCopy[i].some(score => score > 0)) {
                                        availableSlots++;
                                    }
                                }

                                if (availableSlots >= remainingCredits) {
                                    const sortedScores = bestScoreCopyCopy.flat().map((score, index) => ({ score, index }))
                                        .sort((a, b) => b.score - a.score);
                                    for (let k = 0; k < remainingCredits; k++) {
                                        const { index } = sortedScores[k];
                                        const row = Math.floor(index / bestScoreCopyCopy[0].length);
                                        const col = index % bestScoreCopyCopy[0].length;
                                        timetable[row][col] = courseResponse.course.name;
                                        roomtable[row][col] = roomInfo.name;
                                        for (let i = 0; i < bestScoreCopyCopy[row].length; i++) {
                                            bestScoreCopyCopy[row][i] = -1;
                                        }
                                    }
                                    remainingCredits = 0;
                                }
                            }
                        }

                        if (remainingCredits > 0)
                            return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } };
                    } else {
                        for (let k = 0; k < courseResponse.course.credits; k++) {
                            let sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                                .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = preferredRoomInfo.name;
                            for (let i = 0; i < bestScore[row].length; i++) {
                                bestScore[row][i] = -1;
                            }
                        }
                    }
                } else {
                    return { status: statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } };
                }
            }
        }

        return { status: statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } };
    } catch (error) {
        console.error(error);
        return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } };
    }
}
export async function recommendCourse(
    token: string,
    teacher: string,
    room: string | null,
    blocks: string | null
): Promise<{ status: number, timetable: string | null }> {
    let timetable: string[][] | null = convertStringToTable(blocks);
    let errMessage = "";
    try {
        let score: number[][] = Array(6).fill(0).map(() => Array(6).fill(0));
        errMessage = "error while fetching timetable";
        if (timetable) {
            for (let j = 0; j < timetable.length; j++) {
                for (let k = 0; k < timetable[j].length; k++) {
                    if (timetable[j][k] != "0") {
                        score[j][k] = -1;
                    }
                }
            }
        }
        errMessage = "error accessing teacher";
        let { status, teacher: teacherData } = await peekTeacher(token, teacher);
        if (status == statusCodes.OK && teacherData) {
            let scoreValue = scoreTeachers(teacherData.timetable, teacherData.labtable);
            for (let i = 0; i < scoreValue.length; i++) {
                for (let j = 0; j < scoreValue[i].length; j++) {
                    if (scoreValue[i][j] < 0) {
                        score[i][j] = -1;
                    } else {
                        if (score[i][j] >= 0)
                            score[i][j] += scoreValue[i][j];
                    }
                }
            }
        } else {
            return {
                status: status,
                timetable: errMessage
            };
        }

        if (room) {
            errMessage = "error when accessing room";
            let { status, room: roomData } = await peekRoom(token, room);
            if (status == statusCodes.OK && roomData) {
                let scoreValue = scoreRooms(roomData.timetable);
                for (let i = 0; i < scoreValue.length; i++) {
                    for (let j = 0; j < scoreValue[i].length; j++) {
                        if (scoreValue[i][j] < 0) {
                            score[i][j] = -1;
                        }
                    }
                }
            } else {
                return {
                    status: status,
                    timetable: errMessage
                };
            }
        }

        if (!score) {
            return {
                status: statusCodes.BAD_REQUEST,
                timetable: "score is null"
            };
        }
        for (let i = 0; i < timetable.length; i++) {
            for (let j = 0; j < timetable[i].length; j++) {
                if (timetable[i][j] !== "0") {
                    score[i][j] = -1;
                }
            }
        }

        errMessage = "error when merging timetable";

        let maxScore = Math.max(...score.flat());
        if (maxScore > 0) {
            for (let i = 0; i < score.length; i++) {
                for (let j = 0; j < score[i].length; j++) {
                    if (score[i][j] > 0) {
                        score[i][j] /= maxScore;
                    }
                }
            }
        }

        for (let i = 0; i < score.length; i++) {
            for (let j = 0; j < score[i].length - 1; j += 2) {
                if (score[i][j] < 0 || score[i][j + 1] < 0) {
                    score[i][j] = -1;
                    score[i][j + 1] = -1;
                }
            }
        }

        return {
            status: statusCodes.OK,
            timetable: convertTableToString(score.map((row) => row.map((val) => val.toString())))
        };
    } catch {
        return {
            status: statusCodes.INTERNAL_SERVER_ERROR,
            timetable: errMessage
        };
    }
}
export async function saveTimetable(
    JWTtoken: string,
    name: string,
    batch: number,
    courses: string[],
    teachers: string[],
    rooms: string[],
    electives: string|null,
    labs: string|null,
    semester: number,
    defaultRooms: string|null,
    timetable:string,
    roomTimetable:string
): Promise<{status:number}> {
 try {
    const { status, user } = await auth.getPosition(JWTtoken);
    if (user?.orgId == null)
      return {
        status: statusCodes.BAD_REQUEST,
      };
    if (status == statusCodes.OK) {
      if (user && user.role != "viewer") {
        const Section: Section = {
          name: name,
          batch: batch,
          orgId: user.orgId,
          courses: courses,
          teachers:teachers,
          rooms:rooms,
          electives:electives,
          labs:labs,
          defaultRoom: defaultRooms,
          semester: semester,
          timeTable: timetable
        };

        const duplicates = await prisma.section.findFirst({
          where: {
            orgId: Section.orgId,
            name: name,
            batch:batch
          },
        });
        if (duplicates||(courses.length!==teachers.length)||courses.length!==rooms.length) {
          return {
            status: statusCodes.BAD_REQUEST,
          };
        }
        const department=user.department
        const newCourse = await prisma.section.create({
          data: Section,
        });
        const tt=convertStringToTable(timetable)
        for (let i = 0; i < tt.length; i++) {
            for (let j = 0; j < tt[i].length; j++) {
              if (tt[i][j] !== "0") {
                const tCourse=tt[i][j]
                for(let k=0;k<courses.length;k++)
                {
                    if(tCourse==courses[k])
                    {
                        const tTeacher=teachers[k];
                        const teacherResponse = await peekTeacher(JWTtoken, tTeacher,department);
                        if (teacherResponse.status !== statusCodes.OK || !teacherResponse.teacher) {
                            return { status: statusCodes.INTERNAL_SERVER_ERROR  };
                        }
                        const tTeacherTT=convertStringToTable(teacherResponse.teacher.timetable)
                        tTeacherTT[i][j]=name;
                        teacherResponse.teacher.timetable=convertTableToString(tTeacherTT)
                        const updateteacher=await updateTeachers(JWTtoken,tTeacher,department,teacherResponse.teacher)
                        if (updateteacher.status !== statusCodes.OK || !updateteacher.teacher) {
                            return { status: statusCodes.INTERNAL_SERVER_ERROR  };
                        }
                        break;
                    }
                }
              }
            }
          }
          const roomTT=convertStringToTable(roomTimetable)
          console.log(roomTT)
          for(let i=0;i<roomTT.length;i++)
          {
            for(let j=0;j<roomTT[i].length;j++)
            {
                if(roomTT[i][j]!=="0")
                {
                     const existingRoom = await prisma.room.findFirst({
                              where: {
                                orgId: user.orgId,
                                department:
                                  user.role = department,
                                name: roomTT[i][j],
                              },
                            });
                    
                            if (!existingRoom) {
                              return {
                                status: statusCodes.NOT_FOUND,
                              };
                            }
                            const TT=convertStringToTable(existingRoom.timetable)
                            TT[i][j]=name
                            await prisma.room.update({
                              where: {
                                id: existingRoom.id,
                              },
                              data: {
                                timetable: convertTableToString(TT),
                              },
                            });
                    }
                }
            }
        return {
          status: statusCodes.OK,
        };
      }
      // If role is viewer
      return {
        status: statusCodes.FORBIDDEN
      };
    }
    // If status is not OK
    return {
      status: status,
    };
  } catch (e) {
    console.error(e);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR
    };
  }
}

export async function getTimetable(
    JWTtoken: string,
    semester: number
): Promise<{ status: number; section: any[] | null }>{
    try{
         const { status, user } = await auth.getPosition(JWTtoken);
        
            if (user?.orgId == null) {
              return {
                status: statusCodes.BAD_REQUEST,
                section: null,
              };
            }
        
            if (status == statusCodes.OK && user) {
                 let section = await prisma.section.findMany({
                  where: {
                    orgId: user.orgId,
                    semester: semester,
                  },
                  select: {
                    id: true,
                    name: true,
                    batch: true,
                    courses: true,
                    teachers:true,
                    rooms:true,
                    semester:true,
                    orgId:true,
                    timeTable:true,
                  },
                })
              return {
                status: statusCodes.OK,
                section: section,
              };
            } else {
              return {
                status: status,
                section: null,
              };
            }
    }
    catch(error)
    {
        return {
            status: statusCodes.INTERNAL_SERVER_ERROR,
            section: null,
          };
    }
}

export async function deleteSection(
    JWTtoken: string,
    id: number
): Promise<{ status: number }> {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if (user?.orgId == null) {
            return {
                status: statusCodes.BAD_REQUEST,
            };
        }
        if (status == statusCodes.OK && user) {
            const section = await prisma.section.deleteMany({
                where: {
                    orgId: user.orgId,
                    id: id
                },
            });
            return {
                status: statusCodes.OK,
            };
        } else {
            return {
                status: status,
            };
        }
    } catch (error) {
        return {
            status: statusCodes.INTERNAL_SERVER_ERROR,
        };
    }

}
// export async function suggestLab(

// ){

// }
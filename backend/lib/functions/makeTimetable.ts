import { peekCourse } from "../actions/course";
import { getRooms, peekRoom } from "../actions/room";
import { peekTeacher } from "../actions/teacher";
import { statusCodes } from "../types/statusCodes";
import { convertTableToString, scoreRooms, scoreTeachers } from "./common";


// add one more dimemtion of rooms in return val toadd handling of subjects if the room is not specified explicitly
//test all functions, add handling of rooms to admins,
//collision handling
//current function is for non admins.
type returnStrcture={
    timetable:string[][]|null,
    roomtable:string[][]|null
}
export async function suggestTimetable(
    token: string,
    blocks: string[][],
    courses: string[],
    teachers: string[],
    rooms: string[],
    semester: number,
    preferredRooms: string|null,
): Promise<{status:number,returnVal:returnStrcture|null}> {
    try {
        // Initialize the timetable with empty strings
        const timetable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? cell : '0'));
        const roomtable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? '-' : '0'));
        const departmentRoomsResponse = await getRooms(token);
        if (departmentRoomsResponse.status !== statusCodes.OK || !departmentRoomsResponse.rooms) {
            return { status: departmentRoomsResponse.status, returnVal:null};
        }
        let flag=0;
        const roomsInfo = await Promise.all(departmentRoomsResponse.rooms.map(async (room) => {
            const roomResponse = await peekRoom(token, room.name);
            if (roomResponse.status !== statusCodes.OK || !roomResponse.room) {
                flag=1;
            }
            return roomResponse.room;
        }));
        if(flag==1){
            return {status:statusCodes.INTERNAL_SERVER_ERROR,returnVal:null };
        }
        // Iterate over the courses
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const teacher = teachers[i];

            // Retrieve course details
            const courseResponse = await peekCourse(token, course, semester);
            if (courseResponse.status !== statusCodes.OK || !courseResponse.course) {
                return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal:null  };
            }
            // Retrieve teacher details
            const teacherResponse = await peekTeacher(token, teacher);
            if (teacherResponse.status !== statusCodes.OK || !teacherResponse.teacher) {
                return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal:null  };
            }
            let bestScore=scoreTeachers(teacherResponse.teacher.timetable,teacherResponse.teacher.labtable);
            let currRoomInfo=null;
            //create a default room.
            if(!preferredRooms){
                let maxNonNegativeEntries = -1;
                for (const roomInfo of roomsInfo) {
                    if(roomInfo){
                        const roomScore = scoreRooms(roomInfo.timetable);
                        const nonNegativeEntries = roomScore.flat().filter(score => score == 0).length;
                        if (nonNegativeEntries > maxNonNegativeEntries) {
                            maxNonNegativeEntries = nonNegativeEntries;
                            preferredRooms = roomInfo.name;
                        }
                    }
                }
            }
            // Retrieve room details
            //check if specified room is a department name or room name

            //following if statement checks if the specified room is a room (if yes, code is allowed inside)
            if(roomsInfo && rooms[i]!='0'){
                currRoomInfo = roomsInfo.find(room => room?.name === rooms[i]);
                if (!currRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal:null  };
                }
                else{
                    let feasible=scoreRooms(currRoomInfo.timetable);
                    for(let i=0;i<feasible.length;i++){
                        for(let j=0;j<feasible[i].length;j++){
                            if(feasible[i][j]<0){
                                bestScore[i][j]=-1;
                            }
                        }
                        const availableSlots = bestScore.flat().filter(score => score > 0).length;
                        if(courseResponse.course?.credits){
                            if (availableSlots < courseResponse.course?.credits) {
                                return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal:{timetable: timetable,roomtable:null}  };
                            }
                            else{
                                const sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                                    .sort((a, b) => b.score - a.score);

                                for (let k = 0; k < courseResponse.course.credits; k++) {
                                    const { index } = sortedScores[k];
                                    const row = Math.floor(index / bestScore[0].length);
                                    const col = index % bestScore[0].length;
                                    timetable[row][col] = courseResponse.course.name;
                                    roomtable[row][col] = currRoomInfo.name;
                                }
                            }
                        }
                        else{
                            return {status:statusCodes.BAD_REQUEST,returnVal:null};
                        }  
                    }
                }
            }
            else{
                let bestScoreCopy=bestScore
                const preferredRoomInfo = roomsInfo.find(room => room?.name === preferredRooms);
                if (!preferredRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal: null };
                }
                else {
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
                    const availableSlots = bestScore.flat().filter(score => score > 0).length;
                    const sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                        .sort((a, b) => b.score - a.score);
                    if (courseResponse.course?.credits) {
                        if (availableSlots < courseResponse.course?.credits) {
                            for (let k = 0; k < availableSlots; k++) {
                                const { index } = sortedScores[k];
                                const row = Math.floor(index / bestScore[0].length);
                                const col = index % bestScore[0].length;
                                timetable[row][col] = courseResponse.course.name;
                                roomtable[row][col] = preferredRoomInfo.name;
                                bestScoreCopy[row][col] = -1;
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
                                    const availableSlots = bestScoreCopyCopy.flat().filter(score => score > 0).length;
                                    if(availableSlots>=remainingCredits){
                                        const sortedScores = bestScoreCopyCopy.flat().map((score, index) => ({ score, index }))
                                            .sort((a, b) => b.score - a.score);
                                        for (let k = 0; k < remainingCredits; k++) {
                                            const { index } = sortedScores[k];
                                            const row = Math.floor(index / bestScoreCopyCopy[0].length);
                                            const col = index % bestScoreCopyCopy[0].length;
                                            timetable[row][col] = courseResponse.course.name;
                                            roomtable[row][col] = roomInfo.name;
                                        }
                                        remainingCredits=0;
                                    }
                                }
                            }
                            if (remainingCredits > 0)
                                return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } };
                        } 
                        else {
                            for (let k = 0; k < courseResponse.course.credits; k++) {
                                const { index } = sortedScores[k];
                                const row = Math.floor(index / bestScore[0].length);
                                const col = index % bestScore[0].length;
                                timetable[row][col] = courseResponse.course.name;
                                roomtable[row][col] = preferredRoomInfo.name;
                            }
                        }
                    } else {
                        return { status: statusCodes.BAD_REQUEST, returnVal: null };
                    }
                }
            }

        }
        return { status: statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } };
    } catch (error) {
        return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
    }
}

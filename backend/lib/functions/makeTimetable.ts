import { peekCourse } from "../actions/course";
import { getRooms, peekRoom } from "../actions/room";
import { peekTeacher } from "../actions/teacher";
import { statusCodes } from "../types/statusCodes";
import { convertStringToTable, convertTableToString, scoreRooms, scoreTeachers } from "./common";


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
    try {
        // Convert the block string to a 2D array
        const blocks = convertStringToTable(block);
        // Initialize the timetable with empty strings
        const timetable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? cell : '0'));
        const roomtable: string[][] = blocks.map(row => row.map(cell => cell !== '0' ? '-' : '0'));

        //store all rooms of the department in roomsInfo var
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

        //init bfactor of each day array to 1
        let bFactor = Array(6).fill(1);

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
            //create a preffered room if not given.
            if(!preferredRooms){
                let maxNonNegativeEntries = -1;
                for (const roomInfo of roomsInfo) {
                    if(roomInfo){
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
            // Retrieve room details
            //check if specified room is a department name or room name

            //following if statement checks if there is a specified room  (if yes, code is allowed inside)
            if(roomsInfo && rooms[i]!='0'){
                currRoomInfo = roomsInfo.find(room => room?.name === rooms[i]);
                //if specified room not found
                if (!currRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal:null  };
                }
                
                let feasible=scoreRooms(currRoomInfo.timetable);
                for(let i=0;i<feasible.length;i++){
                    for(let j=0;j<feasible[i].length;j++){
                        if(feasible[i][j]<0){
                            bestScore[i][j]=-1;
                        }
                    } 
                    let availableSlots = 0;
                    for (let i = 0; i < bestScore.length; i++) {
                        if (bestScore[i].some(score => score > 0)) {
                            availableSlots++;
                        }
                    }
                    if(courseResponse.course?.credits){
                        //introcude randomness and also divide by bfactor value
                        for(let i=0;i<bestScore.length;i++){
                            for(let j=0;j<bestScore[i].length;j++){
                                if(bestScore[i][j]>0){
                                    bestScore[i][j]=(bestScore[i][j]+randomFactor*Math.random())/bFactor[i];
                                }
                            }
                        }
                        //allot the course
                        for (let k = 0; k < Math.min(courseResponse.course.credits, availableSlots); k++) {
                            const sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                            .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = currRoomInfo.name;
                            bFactor[row]=bFactor[row]+courseResponse.course.bFactor;
                            //prevent allocation on the same day
                            for(let j=0;j<bestScore[i].length;j++){
                                bestScore[row][j]=-1;
                            }
                        }
                        //if available slots are less than the credits of the course, return service unavailable
                        if (availableSlots < courseResponse.course?.credits) {
                            return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal:{timetable: timetable,roomtable:null}  };
                        }
                    }
                    else{
                        return {status:statusCodes.BAD_REQUEST,returnVal:null};
                    }  
                }
            
            }
            //if not specified room
            else{
                //bestScore is used to keep intersections and scores of preffered room, while the copy is used to allocate alternate rooms, if bestScore is not full
                let bestScoreCopy=bestScore;
                const preferredRoomInfo = roomsInfo.find(room => room?.name === preferredRooms);
                if (!preferredRoomInfo) {
                    return { status: statusCodes.BAD_REQUEST, returnVal: null };
                }
                //make sure bestScore contains intersection of teachers and rooms
                let feasible = scoreRooms(preferredRoomInfo.timetable);
                for (let i = 0; i < feasible.length; i++) {
                    for (let j = 0; j < feasible[i].length; j++) {
                        if (feasible[i][j] < 0) {
                            bestScore[i][j] = -1;
                        }
                    }
                }
                ///make sure bestScore and bestScore copy dont allocate when other course are alloted
                for (let i = 0; i < timetable.length; i++) {
                    for (let j = 0; j < timetable[i].length; j++) {
                        if (timetable[i][j] !== '0') {
                            bestScore[i][j] = -1;
                            bestScoreCopy[i][j] = -1;
                        }
                    }
                }
                //count how many intersections are there in bestScore
                let availableSlots = 0;
                for (let i = 0; i < bestScore.length; i++) {
                    if (bestScore[i].some(score => score > 0)) {
                        availableSlots++;
                    }
                }
                if (courseResponse.course?.credits) {
                    //of available slots are leseer than credits, then iterate through all rooms in an attempt to find all possible intersections
                    if (availableSlots < courseResponse.course?.credits) {
                        //allot whatevers possible in the preffered room
                        for (let k = 0; k < availableSlots; k++) {
                            let sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                            .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = preferredRoomInfo.name;
                            for(let i=0;i<bestScore[row].length;i++){
                                bestScoreCopy[row][i] = -1;
                            }
                        }
                        let remainingCredits = courseResponse.course.credits - availableSlots;

                        for (const roomInfo of roomsInfo) {
                            if (remainingCredits <= 0) break;
                            //if room isnt same as prefereed room
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
                                if(availableSlots>=remainingCredits){
                                    const sortedScores = bestScoreCopyCopy.flat().map((score, index) => ({ score, index }))
                                        .sort((a, b) => b.score - a.score);
                                    for (let k = 0; k < remainingCredits; k++) {
                                        const { index } = sortedScores[k];
                                        const row = Math.floor(index / bestScoreCopyCopy[0].length);
                                        const col = index % bestScoreCopyCopy[0].length;
                                        timetable[row][col] = courseResponse.course.name;
                                        roomtable[row][col] = roomInfo.name;
                                        for(let i=0;i<bestScoreCopyCopy[row].length;i++){
                                            bestScoreCopyCopy[row][i] = -1;
                                        }
                                    }
                                    remainingCredits=0;
                                }
                            }
                        }
                        if (remainingCredits > 0)
                            return { status: statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } };
                    } 
                    
                    //if available slots are greater than the credits allot the timetable
                    else {
                        for (let k = 0; k < courseResponse.course.credits; k++) {
                            let sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                            .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = preferredRoomInfo.name;
                            for(let i=0;i<bestScore[row].length;i++){
                                bestScore[row][i]=-1;
                            }
                        }
                    }
                } 
                //if credits not availabe return 0
                else {
                    return { status: statusCodes.BAD_REQUEST, returnVal: null };
                }
            
            }

        }
        return { status: statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } };
    } catch (error) {
        return { status: statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
    }
}

// export async function suggestLab(

// ){

// }
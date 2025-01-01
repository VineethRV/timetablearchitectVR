"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestTimetable = suggestTimetable;
exports.saveTimetable = saveTimetable;
const course_1 = require("../actions/course");
const client_1 = require("@prisma/client");
const auth = __importStar(require("../actions/auth"));
const room_1 = require("../actions/room");
const teacher_1 = require("../actions/teacher");
const statusCodes_1 = require("../types/statusCodes");
const common_1 = require("./common");
const prisma = new client_1.PrismaClient();
// add one more dimemtion of rooms in return val toadd handling of subjects if the room is not specified explicitly
//test all functions, add handling of rooms to admins,
//collision handling
//current function is for non admins.
let randomFactor = 0.1; //introduces some randomness in the allocation of courses to the timetable
async function suggestTimetable(token, block, courses, teachers, rooms, semester, preferredRooms) {
    var _a, _b, _c, _d;
    try {
        // Convert the block string to a 2D array
        const blocks = (0, common_1.convertStringToTable)(block);
        // Initialize the timetable with empty strings
        const timetable = blocks.map(row => row.map(cell => cell !== '0' ? cell : '0'));
        const roomtable = blocks.map(row => row.map(cell => cell !== '0' ? '-' : '0'));
        //store all rooms of the department in roomsInfo var
        const departmentRoomsResponse = await (0, room_1.getRooms)(token);
        if (departmentRoomsResponse.status !== statusCodes_1.statusCodes.OK || !departmentRoomsResponse.rooms) {
            return { status: departmentRoomsResponse.status, returnVal: null };
        }
        let flag = 0;
        const roomsInfo = await Promise.all(departmentRoomsResponse.rooms.map(async (room) => {
            const roomResponse = await (0, room_1.peekRoom)(token, room.name);
            if (roomResponse.status !== statusCodes_1.statusCodes.OK || !roomResponse.room) {
                flag = 1;
            }
            return roomResponse.room;
        }));
        if (flag == 1) {
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
        }
        //init bfactor of each day array to 1
        let bFactor = Array(6).fill(1);
        // Iterate over the courses
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            console.log("course: ", course);
            const teacher = teachers[i];
            // Retrieve course details
            const courseResponse = await (0, course_1.peekCourse)(token, course, semester);
            if (courseResponse.status !== statusCodes_1.statusCodes.OK || !courseResponse.course) {
                return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
            }
            console.log("\ncourse response: ", courseResponse);
            // Retrieve teacher details
            const teacherResponse = await (0, teacher_1.peekTeacher)(token, teacher);
            if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
            }
            console.log("\nteacher response: ", teacherResponse);
            let bestScore = (0, common_1.scoreTeachers)(teacherResponse.teacher.timetable, teacherResponse.teacher.labtable);
            console.log("\nbestScore: ", bestScore);
            let currRoomInfo = null;
            //create a preffered room if not given.
            if (!preferredRooms) {
                console.log("\npreffered room not given");
                let maxNonNegativeEntries = -1;
                for (const roomInfo of roomsInfo) {
                    if (roomInfo) {
                        const roomScore = (0, common_1.scoreRooms)(roomInfo.timetable);
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
                console.log("\npreffered room selecgted: ", preferredRooms);
            }
            // Retrieve room details
            //following if statement checks if there is a specified room  (if yes, code is allowed inside)
            if (roomsInfo && rooms[i] != '0') {
                console.log("\nspecific room: ", rooms[i]);
                currRoomInfo = roomsInfo.find(room => (room === null || room === void 0 ? void 0 : room.name) === rooms[i]);
                //if specified room not found
                if (!currRoomInfo) {
                    return { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null };
                }
                let feasible = (0, common_1.scoreRooms)(currRoomInfo.timetable);
                for (let i = 0; i < feasible.length; i++) {
                    for (let j = 0; j < feasible[i].length; j++) {
                        if (feasible[i][j] < 0) {
                            bestScore[i][j] = -1;
                        }
                    }
                    let availableSlots = 0;
                    for (let i = 0; i < bestScore.length; i++) {
                        if (bestScore[i].some(score => score > 0)) {
                            availableSlots++;
                        }
                    }
                    if ((_a = courseResponse.course) === null || _a === void 0 ? void 0 : _a.credits) {
                        //introcude randomness and also divide by bfactor value
                        for (let i = 0; i < bestScore.length; i++) {
                            for (let j = 0; j < bestScore[i].length; j++) {
                                if (bestScore[i][j] > 0) {
                                    bestScore[i][j] = (bestScore[i][j] + randomFactor * Math.random()) / bFactor[i];
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
                            bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                            //prevent allocation on the same day
                            for (let j = 0; j < bestScore[i].length; j++) {
                                bestScore[row][j] = -1;
                            }
                        }
                        //if available slots are less than the credits of the course, return service unavailable
                        if (availableSlots < ((_b = courseResponse.course) === null || _b === void 0 ? void 0 : _b.credits)) {
                            return { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } };
                        }
                    }
                    else {
                        return { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null };
                    }
                }
            }
            //if not specified room
            else {
                console.log("\nno specific room");
                //bestScore is used to keep intersections and scores of preffered room, while the copy is used to allocate alternate rooms, if bestScore is not full
                let bestScoreCopy = bestScore;
                const preferredRoomInfo = roomsInfo.find(room => (room === null || room === void 0 ? void 0 : room.name) === preferredRooms);
                console.log("\nroom used: ", preferredRoomInfo === null || preferredRoomInfo === void 0 ? void 0 : preferredRoomInfo.name);
                if (!preferredRoomInfo) {
                    return { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null };
                }
                //make sure bestScore contains intersection of teachers and rooms
                let feasible = (0, common_1.scoreRooms)(preferredRoomInfo.timetable);
                for (let i = 0; i < feasible.length; i++) {
                    for (let j = 0; j < feasible[i].length; j++) {
                        if (feasible[i][j] < 0) {
                            bestScore[i][j] = -1;
                        }
                    }
                }
                console.log("\nbestScore: ", bestScore);
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
                console.log("\navailable slots:", availableSlots);
                if ((_c = courseResponse.course) === null || _c === void 0 ? void 0 : _c.credits) {
                    //of available slots are leseer than credits, then iterate through all rooms in an attempt to find all possible intersections
                    if (availableSlots < ((_d = courseResponse.course) === null || _d === void 0 ? void 0 : _d.credits)) {
                        //allot whatevers possible in the preffered room
                        for (let k = 0; k < availableSlots; k++) {
                            let sortedScores = bestScore.flat().map((score, index) => ({ score, index }))
                                .sort((a, b) => b.score - a.score);
                            const { index } = sortedScores[k];
                            const row = Math.floor(index / bestScore[0].length);
                            const col = index % bestScore[0].length;
                            timetable[row][col] = courseResponse.course.name;
                            roomtable[row][col] = preferredRoomInfo.name;
                            for (let i = 0; i < bestScore[row].length; i++) {
                                bestScoreCopy[row][i] = -1;
                            }
                        }
                        let remainingCredits = courseResponse.course.credits - availableSlots;
                        for (const roomInfo of roomsInfo) {
                            if (remainingCredits <= 0)
                                break;
                            //if room isnt same as prefereed room
                            if (roomInfo && roomInfo.name !== preferredRoomInfo.name) {
                                let feasible = (0, common_1.scoreRooms)(roomInfo.timetable);
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
                            return { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } };
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
                            for (let i = 0; i < bestScore[row].length; i++) {
                                bestScore[row][i] = -1;
                            }
                        }
                    }
                }
                //if credits not availabe return 0
                else {
                    return { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null };
                }
            }
        }
        return { status: statusCodes_1.statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } };
    }
    catch (error) {
        return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null };
    }
}
async function saveTimetable(JWTtoken, name, batch, courses, teachers, rooms, electives, labs, semester, defaultRooms, timetable) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
            };
        if (status == statusCodes_1.statusCodes.OK) {
            if (user && user.role != "viewer") {
                const Section = {
                    name: name,
                    batch: batch,
                    orgId: user.orgId,
                    courses: courses,
                    teachers: teachers,
                    rooms: rooms,
                    electives: electives,
                    labs: labs,
                    defaultRoom: defaultRooms,
                    semester: semester,
                    timeTable: timetable
                };
                const duplicates = await prisma.section.findFirst({
                    where: {
                        orgId: Section.orgId,
                        name: name,
                        batch: batch
                    },
                });
                if (duplicates) {
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                    };
                }
                // If check is successful
                const newCourse = await prisma.section.create({
                    data: Section,
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                };
            }
            // If role is viewer
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN
            };
        }
        // If status is not OK
        return {
            status: status,
        };
    }
    catch (e) {
        console.error(e);
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR
        };
    }
}
// export async function suggestLab(
// ){
// }

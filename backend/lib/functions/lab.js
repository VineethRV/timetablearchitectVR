"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../actions/room");
const teacher_1 = require("../actions/teacher");
const statusCodes_1 = require("../types/statusCodes");
const common_1 = require("./common");
// function convertStringToTable(timetableString: string): string[][] {
//     return timetableString.split(";").map((row) => row.split(","));
// }
//create a lab object and pass to this function to generate the optimised 
//To call this function place an api call to /api/getLabRecommendation with the body, couse list, teachername list and room name list. also pass token in the header
//after that the function returns a status of 200 and a timetable string, with 0 in place of empty slots and names of subjects in place of filled slots. parse it using the convertStringToTable function(available in common.ts)
//if a collision occurs it returns alloted timetable till the collisiion occured and status code 503(Servie unavailable)
function getRecommendations(token, lab) {
    return __awaiter(this, void 0, void 0, function* () {
        let timetable = null;
        //iterate through each course, and each teacher and room
        try {
            for (let i = 0; i < lab.courses.length; i++) {
                //get every teacher and room
                let teachers = [];
                let score = null;
                for (let j = 0; j < teachers.length; j++) {
                    let { status, teacher } = (yield (0, teacher_1.peekTeacher)(token, lab.teachers[j]));
                    if (status == statusCodes_1.statusCodes.OK && teacher) {
                        teachers.push(teacher);
                        let scoreValue = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                        if (!score) {
                            score = scoreValue;
                            for (let i = 0; i < scoreValue.length; i++) {
                                for (let j = 0; j < scoreValue[i].length; j++) {
                                    if (scoreValue[i][j] < 0) {
                                        score[i][j] = -1;
                                    }
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < scoreValue.length; i++) {
                                for (let j = 0; j < scoreValue[i].length; j++) {
                                    if (scoreValue[i][j] < 0) {
                                        score[i][j] = -1;
                                    }
                                    else {
                                        if (score[i][j] != -1)
                                            score[i][j] += scoreValue[i][j];
                                    }
                                }
                            }
                        }
                    }
                    else
                        return {
                            status: status,
                            timetable: null
                        };
                }
                let rooms = [];
                for (let k = 0; k < lab.rooms.length; k++) {
                    let { status, room } = yield (0, room_1.peekRoom)(token, lab.rooms[k]);
                    if (status == statusCodes_1.statusCodes.OK && room) {
                        rooms.push(room);
                        let scoreValue = (0, common_1.scoreRooms)(room.timetable);
                        if (!score) {
                            return {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                timetable: null
                            };
                        }
                        for (let i = 0; i < scoreValue.length; i++) {
                            for (let j = 0; j < scoreValue[i].length; j++) {
                                if (scoreValue[i][j] < 0) {
                                    score[i][j] = -1;
                                }
                            }
                        }
                    }
                    else {
                        return {
                            status: status,
                            timetable: null
                        };
                    }
                }
                if (!score) {
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        timetable: null
                    };
                }
                //we have got the top valid intersections.
                if (!timetable) {
                    timetable = Array(score.length).fill(null).map(() => Array(score[0].length).fill("0"));
                }
                for (let i = 0; i < timetable.length; i++) {
                    for (let j = 0; j < timetable[i].length; j++) {
                        if (timetable[i][j] !== "0") {
                            score[i][j] = -1;
                        }
                    }
                }
                for (let i = 0; i < score.length; i++) {
                    for (let j = 0; j < score[i].length - 1; j += 2) {
                        if (score[i][j] == -1 || score[i][j + 1] == -1) {
                            score[i][j] = -1;
                            score[i][j + 1] = -1;
                        }
                    }
                }
                let maxSum = -1;
                let maxSumIndices = { i: -1, j: -1 };
                for (let i = 0; i < score.length; i++) {
                    for (let j = 0; j < score[i].length - 1; j += 2) {
                        let sum = score[i][j] + score[i][j + 1];
                        if (sum > maxSum) {
                            maxSum = sum;
                            maxSumIndices = { i, j };
                        }
                    }
                }
                if (maxSumIndices.i !== -1 && maxSumIndices.j !== -1) {
                    timetable[maxSumIndices.i][maxSumIndices.j] = lab.courses[i];
                    timetable[maxSumIndices.i][maxSumIndices.j + 1] = lab.courses[i];
                }
                else {
                    return {
                        status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE,
                        timetable: (0, common_1.convertTableToString)(timetable)
                    };
                }
            }
            return {
                status: statusCodes_1.statusCodes.OK,
                timetable: (0, common_1.convertTableToString)(timetable)
            };
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                timetable: null
            };
        }
    });
}

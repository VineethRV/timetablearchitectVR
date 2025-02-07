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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = getRecommendations;
exports.recommendLab = recommendLab;
var room_1 = require("../actions/room");
var teacher_1 = require("../actions/teacher");
var statusCodes_1 = require("../types/statusCodes");
var common_1 = require("./common");
// function convertStringToTable(timetableString: string): string[][] {
//     return timetableString.split(";").map((row) => row.split(","));
// }
//create a lab object and pass to this function to generate the optimised
//To call this function place an api call to /api/getLabRecommendation with the body, couse list, teachername list and room name list. also pass token in the header
//after that the function returns a status of 200 and a timetable string, with 0 in place of empty slots and names of subjects in place of filled slots. parse it using the convertStringToTable function(available in common.ts)
//if a collision occurs it returns alloted timetable till the collisiion occured and status code 503(Servie unavailable)
function getRecommendations(token, lab, blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var timetable, labAllocated, _loop_1, i, state_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timetable = (0, common_1.convertStringToTable)(blocks);
                    labAllocated = [false, false, false, false, false, false];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    _loop_1 = function (i) {
                        var teachers, score, j, k, k, j, _c, status_1, teacher, scoreValue, i_1, j_1, rooms, k, _d, status_2, room, scoreValue, i_2, j, i_3, j, maxSum, maxSumIndices, i_4, j, sum, score_1, t, teacherScore, i_5, j, r, roomScore, i_6, j, alloted, day, period, courseIndex, subScore, subTeachers, subRooms, t, _e, status_3, teacher, teacherScore, i_7, j, r, _f, status_4, room, roomScore, i_8, j, i_9, j, j, maxSubScore, maxSubScoreIndices, i_10, j, sum;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    teachers = [];
                                    score = [
                                        [0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0],
                                    ];
                                    //block places in score where timetable is already alloted
                                    if (timetable) {
                                        for (j = 0; j < timetable.length; j++) {
                                            if (labAllocated[j]) {
                                                for (k = 0; k < timetable[j].length; k++) {
                                                    score[j][k] = -1;
                                                }
                                                continue;
                                            }
                                            for (k = 0; k < timetable[j].length; k++) {
                                                if (timetable[j][k] != "0") {
                                                    score[j][k] = -1;
                                                }
                                            }
                                        }
                                    }
                                    console.log("timetable", timetable);
                                    j = 0;
                                    _g.label = 1;
                                case 1:
                                    if (!(j < lab.teachers[i].length)) return [3 /*break*/, 4];
                                    if (lab.teachers[i][j] == "") {
                                        return [3 /*break*/, 3];
                                    }
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, lab.teachers[i][j])];
                                case 2:
                                    _c = _g.sent(), status_1 = _c.status, teacher = _c.teacher;
                                    if (status_1 == statusCodes_1.statusCodes.OK && teacher) {
                                        teachers.push(teacher);
                                        scoreValue = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                                        console.log("scoreT", scoreValue);
                                        if (score.length == 0) {
                                            score = scoreValue;
                                        }
                                        else {
                                            for (i_1 = 0; i_1 < scoreValue.length; i_1++) {
                                                for (j_1 = 0; j_1 < scoreValue[i_1].length; j_1++) {
                                                    if (scoreValue[i_1][j_1] < 0) {
                                                        score[i_1][j_1] = -1;
                                                    }
                                                    else {
                                                        if (score[i_1][j_1] >= 0)
                                                            score[i_1][j_1] += scoreValue[i_1][j_1];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                        return [2 /*return*/, { value: {
                                                    status: status_1,
                                                    timetable: "teacher error",
                                                } }];
                                    _g.label = 3;
                                case 3:
                                    j++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    rooms = [];
                                    k = 0;
                                    _g.label = 5;
                                case 5:
                                    if (!(k < lab.rooms[i].length)) return [3 /*break*/, 8];
                                    if (lab.rooms[i][k] == "") {
                                        return [3 /*break*/, 7];
                                    }
                                    return [4 /*yield*/, (0, room_1.peekRoom)(token, lab.rooms[i][k])];
                                case 6:
                                    _d = _g.sent(), status_2 = _d.status, room = _d.room;
                                    if (status_2 == statusCodes_1.statusCodes.OK && room) {
                                        rooms.push(room);
                                        scoreValue = (0, common_1.scoreRooms)(room.timetable);
                                        console.log("RoomT", scoreValue);
                                        if (!score) {
                                            return [2 /*return*/, { value: {
                                                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                                                        timetable: null,
                                                    } }];
                                        }
                                        for (i_2 = 0; i_2 < scoreValue.length; i_2++) {
                                            for (j = 0; j < scoreValue[i_2].length; j++) {
                                                if (scoreValue[i_2][j] < 0) {
                                                    score[i_2][j] = -1;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        return [2 /*return*/, { value: {
                                                    status: status_2,
                                                    timetable: "Room error",
                                                } }];
                                    }
                                    _g.label = 7;
                                case 7:
                                    k++;
                                    return [3 /*break*/, 5];
                                case 8:
                                    if (!score) {
                                        return [2 /*return*/, { value: {
                                                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                                                    timetable: null,
                                                } }];
                                    }
                                    console.log(score);
                                    console.log(timetable);
                                    //we have got the top valid intersections.
                                    if (!timetable) {
                                        timetable = Array(score.length)
                                            .fill(null)
                                            .map(function () { return Array(score[0].length).fill("0"); });
                                    }
                                    //group 2 periods together
                                    for (i_3 = 0; i_3 < score.length; i_3++) {
                                        for (j = 0; j < score[i_3].length - 1; j += 2) {
                                            if (score[i_3][j] < 0 || score[i_3][j + 1] < 0) {
                                                score[i_3][j] = -1;
                                                score[i_3][j + 1] = -1;
                                            }
                                        }
                                    }
                                    maxSum = -1;
                                    maxSumIndices = { i: -1, j: -1 };
                                    for (i_4 = 0; i_4 < score.length; i_4++) {
                                        for (j = 0; j < score[i_4].length - 1; j += 2) {
                                            sum = score[i_4][j] + score[i_4][j + 1];
                                            if (sum > maxSum) {
                                                maxSum = sum;
                                                maxSumIndices = { i: i_4, j: j };
                                            }
                                        }
                                    }
                                    if (!(maxSumIndices.i !== -1 && maxSumIndices.j !== -1)) return [3 /*break*/, 9];
                                    timetable[maxSumIndices.i][maxSumIndices.j] = lab.courses[i];
                                    timetable[maxSumIndices.i][maxSumIndices.j + 1] = lab.courses[i];
                                    labAllocated[maxSumIndices.i] = true;
                                    return [3 /*break*/, 23];
                                case 9:
                                    score_1 = Array(6)
                                        .fill(0)
                                        .map(function () { return Array(6).fill(0); });
                                    for (t = 0; t < teachers.length; t++) {
                                        teacherScore = (0, common_1.scoreTeachers)(teachers[t].timetable, teachers[t].labtable);
                                        for (i_5 = 0; i_5 < teacherScore.length; i_5++) {
                                            for (j = 0; j < teacherScore[i_5].length; j++) {
                                                if (teacherScore[i_5][j] < 0) {
                                                    score_1[i_5][j] = -1;
                                                }
                                                else if (score_1[i_5][j] >= 0) {
                                                    score_1[i_5][j] += teacherScore[i_5][j];
                                                }
                                            }
                                        }
                                    }
                                    for (r = 0; r < rooms.length; r++) {
                                        roomScore = (0, common_1.scoreRooms)(rooms[r].timetable);
                                        for (i_6 = 0; i_6 < roomScore.length; i_6++) {
                                            for (j = 0; j < roomScore[i_6].length; j++) {
                                                if (roomScore[i_6][j] < 0) {
                                                    score_1[i_6][j] = -1;
                                                }
                                            }
                                        }
                                    }
                                    alloted = false;
                                    day = 0;
                                    _g.label = 10;
                                case 10:
                                    if (!(day < score_1.length && !alloted)) return [3 /*break*/, 22];
                                    period = 0;
                                    _g.label = 11;
                                case 11:
                                    if (!(period < score_1[day].length && !alloted)) return [3 /*break*/, 21];
                                    if (!(score_1[day][period] >= 0 &&
                                        blocks &&
                                        blocks[day][period] == "0")) return [3 /*break*/, 20];
                                    courseIndex = lab.courses.indexOf(timetable[day][period]);
                                    if (!(courseIndex !== -1)) return [3 /*break*/, 20];
                                    subScore = Array(6)
                                        .fill(0)
                                        .map(function () { return Array(6).fill(0); });
                                    subTeachers = lab.teachers[courseIndex];
                                    subRooms = lab.rooms[courseIndex];
                                    t = 0;
                                    _g.label = 12;
                                case 12:
                                    if (!(t < subTeachers.length)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, subTeachers[t])];
                                case 13:
                                    _e = _g.sent(), status_3 = _e.status, teacher = _e.teacher;
                                    if (status_3 == statusCodes_1.statusCodes.OK && teacher) {
                                        teacherScore = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                                        for (i_7 = 0; i_7 < teacherScore.length; i_7++) {
                                            for (j = 0; j < teacherScore[i_7].length; j++) {
                                                if (teacherScore[i_7][j] < 0) {
                                                    subScore[i_7][j] = -1;
                                                }
                                                else if (subScore[i_7][j] >= 0) {
                                                    subScore[i_7][j] += teacherScore[i_7][j];
                                                }
                                            }
                                        }
                                    }
                                    _g.label = 14;
                                case 14:
                                    t++;
                                    return [3 /*break*/, 12];
                                case 15:
                                    r = 0;
                                    _g.label = 16;
                                case 16:
                                    if (!(r < subRooms.length)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, (0, room_1.peekRoom)(token, subRooms[r])];
                                case 17:
                                    _f = _g.sent(), status_4 = _f.status, room = _f.room;
                                    if (status_4 == statusCodes_1.statusCodes.OK && room) {
                                        roomScore = (0, common_1.scoreRooms)(room.timetable);
                                        for (i_8 = 0; i_8 < roomScore.length; i_8++) {
                                            for (j = 0; j < roomScore[i_8].length; j++) {
                                                if (roomScore[i_8][j] < 0) {
                                                    subScore[i_8][j] = -1;
                                                }
                                            }
                                        }
                                    }
                                    _g.label = 18;
                                case 18:
                                    r++;
                                    return [3 /*break*/, 16];
                                case 19:
                                    for (i_9 = 0; i_9 < subScore.length; i_9++) {
                                        if (labAllocated[i_9]) {
                                            for (j = 0; j < subScore[i_9].length; j++) {
                                                subScore[i_9][j] = -1;
                                            }
                                        }
                                        else {
                                            for (j = 0; j < subScore[i_9].length; j++) {
                                                if (subScore[i_9][j] >= 0 &&
                                                    timetable &&
                                                    timetable[i_9][j] !== "0") {
                                                    subScore[i_9][j] = -1;
                                                }
                                            }
                                        }
                                    }
                                    maxSubScore = -1;
                                    maxSubScoreIndices = { i: -1, j: -1 };
                                    for (i_10 = 0; i_10 < subScore.length; i_10++) {
                                        for (j = 0; j < subScore[i_10].length - 1; j += 2) {
                                            sum = subScore[i_10][j] + subScore[i_10][j + 1];
                                            if (sum > maxSubScore) {
                                                maxSubScore = sum;
                                                maxSubScoreIndices = { i: i_10, j: j };
                                            }
                                        }
                                    }
                                    if (maxSubScoreIndices.i !== -1 &&
                                        maxSubScoreIndices.j !== -1) {
                                        timetable[maxSubScoreIndices.i][maxSubScoreIndices.j] =
                                            lab.courses[courseIndex];
                                        timetable[maxSubScoreIndices.i][maxSubScoreIndices.j + 1] =
                                            lab.courses[courseIndex];
                                        labAllocated[maxSubScoreIndices.i] = true;
                                        alloted = true;
                                        timetable[day][period + 1] = lab.courses[i];
                                        timetable[day][period] = lab.courses[i];
                                    }
                                    _g.label = 20;
                                case 20:
                                    period += 2;
                                    return [3 /*break*/, 11];
                                case 21:
                                    day++;
                                    return [3 /*break*/, 10];
                                case 22:
                                    if (!alloted)
                                        return [2 /*return*/, { value: {
                                                    status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE,
                                                    timetable: (0, common_1.convertTableToString)(timetable),
                                                } }];
                                    _g.label = 23;
                                case 23: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < lab.courses.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    state_1 = _b.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        timetable: (0, common_1.convertTableToString)(timetable),
                    }];
                case 6:
                    _a = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            timetable: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function recommendLab(token, Lteachers, Lrooms, blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var timetable, errMessage, teachers, score, j, k, j, _a, status_5, teacher, scoreValue, i, j_2, rooms, k, _b, status_6, room, scoreValue, i, j, i, j, maxScore, i, j, i, j, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    timetable = (0, common_1.convertStringToTable)(blocks);
                    errMessage = "";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 10, , 11]);
                    teachers = [];
                    score = [
                        [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0],
                    ];
                    errMessage = "error while fetching timetable";
                    if (timetable) {
                        for (j = 0; j < timetable.length; j++) {
                            for (k = 0; k < timetable[j].length; k++) {
                                if (timetable[j][k] != "0") {
                                    score[j][k] = -1;
                                }
                            }
                        }
                    }
                    errMessage = "error accessing teacher";
                    j = 0;
                    _d.label = 2;
                case 2:
                    if (!(j < Lteachers.length)) return [3 /*break*/, 5];
                    errMessage = "error when fetching teacher: " + Lteachers[j];
                    if (!(Lteachers[j] != "")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, Lteachers[j])];
                case 3:
                    _a = _d.sent(), status_5 = _a.status, teacher = _a.teacher;
                    if (status_5 == statusCodes_1.statusCodes.OK && teacher) {
                        teachers.push(teacher);
                        scoreValue = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                        console.log("scoreT", scoreValue);
                        if (score.length == 0) {
                            score = scoreValue;
                        }
                        else {
                            for (i = 0; i < scoreValue.length; i++) {
                                for (j_2 = 0; j_2 < scoreValue[i].length; j_2++) {
                                    if (scoreValue[i][j_2] < 0) {
                                        score[i][j_2] = -1;
                                    }
                                    else {
                                        if (score[i][j_2] >= 0)
                                            score[i][j_2] += scoreValue[i][j_2];
                                    }
                                }
                            }
                        }
                    }
                    else {
                        return [2 /*return*/, {
                                status: status_5,
                                timetable: errMessage,
                            }];
                    }
                    _d.label = 4;
                case 4:
                    j++;
                    return [3 /*break*/, 2];
                case 5:
                    rooms = [];
                    errMessage = "error when accessing rooms";
                    k = 0;
                    _d.label = 6;
                case 6:
                    if (!(k < Lrooms.length)) return [3 /*break*/, 9];
                    if (Lrooms[k] == "") {
                        return [3 /*break*/, 8];
                    }
                    errMessage = "error when fetching: " + Lrooms[k];
                    return [4 /*yield*/, (0, room_1.peekRoom)(token, Lrooms[k])];
                case 7:
                    _b = _d.sent(), status_6 = _b.status, room = _b.room;
                    if (status_6 == statusCodes_1.statusCodes.OK && room) {
                        rooms.push(room);
                        scoreValue = (0, common_1.scoreRooms)(room.timetable);
                        console.log("RoomT", scoreValue);
                        if (!score) {
                            return [2 /*return*/, {
                                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                                    timetable: errMessage,
                                }];
                        }
                        for (i = 0; i < scoreValue.length; i++) {
                            for (j = 0; j < scoreValue[i].length; j++) {
                                if (scoreValue[i][j] < 0) {
                                    score[i][j] = -1;
                                }
                            }
                        }
                    }
                    else {
                        return [2 /*return*/, {
                                status: status_6,
                                timetable: errMessage,
                            }];
                    }
                    _d.label = 8;
                case 8:
                    k++;
                    return [3 /*break*/, 6];
                case 9:
                    if (!score) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                timetable: "score is null",
                            }];
                    }
                    for (i = 0; i < timetable.length; i++) {
                        for (j = 0; j < timetable[i].length; j++) {
                            if (timetable[i][j] !== "0") {
                                score[i][j] = -1;
                            }
                        }
                    }
                    errMessage = "error when merging timetable";
                    maxScore = Math.max.apply(Math, score.flat());
                    if (maxScore > 0) {
                        for (i = 0; i < score.length; i++) {
                            for (j = 0; j < score[i].length; j++) {
                                if (score[i][j] > 0) {
                                    score[i][j] /= maxScore;
                                }
                            }
                        }
                    }
                    for (i = 0; i < score.length; i++) {
                        for (j = 0; j < score[i].length - 1; j += 2) {
                            if (score[i][j] < 0 || score[i][j + 1] < 0) {
                                score[i][j] = -1;
                                score[i][j + 1] = -1;
                            }
                        }
                    }
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            timetable: (0, common_1.convertTableToString)(score.map(function (row) { return row.map(function (val) { return val.toString(); }); })),
                        }];
                case 10:
                    _c = _d.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            timetable: errMessage,
                        }];
                case 11: return [2 /*return*/];
            }
        });
    });
}

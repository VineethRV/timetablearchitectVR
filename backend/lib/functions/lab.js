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
                        var teachers, score, j, k, k, j, _c, status_1, teacher, scoreValue, i_1, j_1, rooms, k, _d, status_2, room, scoreValue, i_2, j, i_3, j, maxSum, maxSumIndices, i_4, j, sum;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    teachers = [];
                                    score = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
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
                                    _e.label = 1;
                                case 1:
                                    if (!(j < lab.teachers[i].length)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, lab.teachers[i][j])];
                                case 2:
                                    _c = (_e.sent()), status_1 = _c.status, teacher = _c.teacher;
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
                                                    timetable: null
                                                } }];
                                    _e.label = 3;
                                case 3:
                                    j++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    rooms = [];
                                    k = 0;
                                    _e.label = 5;
                                case 5:
                                    if (!(k < lab.rooms[i].length)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, (0, room_1.peekRoom)(token, lab.rooms[i][k])];
                                case 6:
                                    _d = _e.sent(), status_2 = _d.status, room = _d.room;
                                    if (status_2 == statusCodes_1.statusCodes.OK && room) {
                                        rooms.push(room);
                                        scoreValue = (0, common_1.scoreRooms)(room.timetable);
                                        console.log("RoomT", scoreValue);
                                        if (!score) {
                                            return [2 /*return*/, { value: {
                                                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                                                        timetable: null
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
                                                    timetable: null
                                                } }];
                                    }
                                    _e.label = 7;
                                case 7:
                                    k++;
                                    return [3 /*break*/, 5];
                                case 8:
                                    if (!score) {
                                        return [2 /*return*/, { value: {
                                                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                                                    timetable: null
                                                } }];
                                    }
                                    console.log(score);
                                    console.log(timetable);
                                    //we have got the top valid intersections.
                                    if (!timetable) {
                                        timetable = Array(score.length).fill(null).map(function () { return Array(score[0].length).fill("0"); });
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
                                    if (maxSumIndices.i !== -1 && maxSumIndices.j !== -1) {
                                        timetable[maxSumIndices.i][maxSumIndices.j] = lab.courses[i];
                                        timetable[maxSumIndices.i][maxSumIndices.j + 1] = lab.courses[i];
                                        labAllocated[maxSumIndices.i] = true;
                                    }
                                    else {
                                        return [2 /*return*/, { value: {
                                                    status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE,
                                                    timetable: (0, common_1.convertTableToString)(timetable)
                                                } }];
                                    }
                                    return [2 /*return*/];
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
                        timetable: (0, common_1.convertTableToString)(timetable)
                    }];
                case 6:
                    _a = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            timetable: null
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function recommendLab(token, Lteachers, Lrooms, blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var timetable, teachers, score_1, j, k, j, _a, status_3, teacher, scoreValue, i, j_2, rooms, k, _b, status_4, room, scoreValue, i, j_3, i, j_4, i, j_5, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    timetable = (0, common_1.convertStringToTable)(blocks);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 10, , 11]);
                    teachers = [];
                    score_1 = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
                    if (timetable) {
                        for (j = 0; j < timetable.length; j++) {
                            for (k = 0; k < timetable[j].length; k++) {
                                if (timetable[j][k] != "0") {
                                    score_1[j][k] = -1;
                                }
                            }
                        }
                    }
                    j = 0;
                    _d.label = 2;
                case 2:
                    if (!(j < Lteachers.length)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, Lteachers[j])];
                case 3:
                    _a = (_d.sent()), status_3 = _a.status, teacher = _a.teacher;
                    if (status_3 == statusCodes_1.statusCodes.OK && teacher) {
                        teachers.push(teacher);
                        scoreValue = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                        console.log("scoreT", scoreValue);
                        if (score_1.length == 0) {
                            score_1 = scoreValue;
                        }
                        else {
                            for (i = 0; i < scoreValue.length; i++) {
                                for (j_2 = 0; j_2 < scoreValue[i].length; j_2++) {
                                    if (scoreValue[i][j_2] < 0) {
                                        score_1[i][j_2] = -1;
                                    }
                                    else {
                                        if (score_1[i][j_2] >= 0)
                                            score_1[i][j_2] += scoreValue[i][j_2];
                                    }
                                }
                            }
                        }
                    }
                    rooms = [];
                    k = 0;
                    _d.label = 4;
                case 4:
                    if (!(k < Lrooms.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, room_1.peekRoom)(token, Lrooms[k])];
                case 5:
                    _b = _d.sent(), status_4 = _b.status, room = _b.room;
                    if (status_4 == statusCodes_1.statusCodes.OK && room) {
                        rooms.push(room);
                        scoreValue = (0, common_1.scoreRooms)(room.timetable);
                        console.log("RoomT", scoreValue);
                        if (!score_1) {
                            return [2 /*return*/, {
                                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                                    timetable: null
                                }];
                        }
                        for (i = 0; i < scoreValue.length; i++) {
                            for (j_3 = 0; j_3 < scoreValue[i].length; j_3++) {
                                if (scoreValue[i][j_3] < 0) {
                                    score_1[i][j_3] = -1;
                                }
                            }
                        }
                    }
                    else {
                        return [2 /*return*/, {
                                status: status_4,
                                timetable: null
                            }];
                    }
                    _d.label = 6;
                case 6:
                    k++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!score_1) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                timetable: null
                            }];
                    }
                    if (!timetable) {
                        timetable = Array(score_1.length).fill(null).map(function () { return Array(score_1[0].length).fill("0"); });
                    }
                    for (i = 0; i < timetable.length; i++) {
                        for (j_4 = 0; j_4 < timetable[i].length; j_4++) {
                            if (timetable[i][j_4] !== "0") {
                                score_1[i][j_4] = -1;
                            }
                        }
                    }
                    for (i = 0; i < score_1.length; i++) {
                        for (j_5 = 0; j_5 < score_1[i].length - 1; j_5 += 2) {
                            if (score_1[i][j_5] < 0 || score_1[i][j_5 + 1] < 0) {
                                score_1[i][j_5] = -1;
                                score_1[i][j_5 + 1] = -1;
                            }
                        }
                    }
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            timetable: (0, common_1.convertTableToString)(score_1.map(function (row) { return row.map(function (val) { return val.toString(); }); }))
                        }];
                case 8:
                    j++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        timetable: (0, common_1.convertTableToString)(timetable)
                    }];
                case 10:
                    _c = _d.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            timetable: null
                        }];
                case 11: return [2 /*return*/];
            }
        });
    });
}

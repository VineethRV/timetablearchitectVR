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
exports.suggestTimetable = suggestTimetable;
exports.recommendCourse = recommendCourse;
exports.saveTimetable = saveTimetable;
exports.getTimetable = getTimetable;
exports.deleteSection = deleteSection;
var course_1 = require("../actions/course");
var client_1 = require("@prisma/client");
var auth = require("../actions/auth");
var room_1 = require("../actions/room");
var teacher_1 = require("../actions/teacher");
var statusCodes_1 = require("../types/statusCodes");
var common_1 = require("./common");
var prisma = new client_1.PrismaClient();
// add one more dimemtion of rooms in return val toadd handling of subjects if the room is not specified explicitly
//test all functions, add handling of rooms to admins,
//collision handling
//current function is for non admins.
var randomFactor = 0.1; //introduces some randomness in the allocation of courses to the timetable
function suggestTimetable(token, block, courses, teachers, rooms, semester, preferredRooms) {
    return __awaiter(this, void 0, void 0, function () {
        var errMessage, blocks, timetable, roomtable, departmentRoomsResponse, flag_1, roomsInfo, bFactor, _loop_1, i, state_1, error_1;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    errMessage = "";
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 8, , 9]);
                    console.log("Converting block string to table");
                    errMessage = "error while converting block string to table";
                    blocks = (0, common_1.convertStringToTable)(block);
                    timetable = blocks.map(function (row) { return row.map(function (cell) { return cell !== '0' ? cell : '0'; }); });
                    roomtable = blocks.map(function (row) { return row.map(function (cell) { return cell !== '0' ? '-' : '0'; }); });
                    console.log("Fetching department rooms");
                    errMessage = "error while fetching department rooms";
                    return [4 /*yield*/, (0, room_1.getRooms)(token)];
                case 2:
                    departmentRoomsResponse = _e.sent();
                    if (departmentRoomsResponse.status !== statusCodes_1.statusCodes.OK || !departmentRoomsResponse.rooms) {
                        return [2 /*return*/, { status: departmentRoomsResponse.status, returnVal: { timetable: [[errMessage]], roomtable: null } }];
                    }
                    flag_1 = 0;
                    return [4 /*yield*/, Promise.all(departmentRoomsResponse.rooms.map(function (room) { return __awaiter(_this, void 0, void 0, function () {
                            var roomResponse;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, room_1.peekRoom)(token, room.name)];
                                    case 1:
                                        roomResponse = _a.sent();
                                        if (roomResponse.status !== statusCodes_1.statusCodes.OK || !roomResponse.room) {
                                            flag_1 = 1;
                                        }
                                        return [2 /*return*/, roomResponse.room];
                                }
                            });
                        }); }))];
                case 3:
                    roomsInfo = _e.sent();
                    if (flag_1 == 1) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } }];
                    }
                    bFactor = Array(6).fill(1);
                    _loop_1 = function (i) {
                        var course, teacher, courseResponse, teacherResponse, bestScore, currRoomInfo, maxNonNegativeEntries, _i, roomsInfo_1, roomInfo, roomScore, nonNegativeEntries, i_1, j, feasible, i_2, j, availableSlots, i_3, i_4, j, k, sortedScores, index, row, col, j, bestScoreCopy, preferredRoomInfo, feasible, i_5, j, i_6, j, availableSlots, i_7, k, sortedScores, index, row, col, i_8, remainingCredits, _f, roomsInfo_2, roomInfo, feasible_1, bestScoreCopyCopy, i_9, j, availableSlots_1, i_10, sortedScores, k, index, row, col, i_11, k, sortedScores, index, row, col, i_12;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    course = courses[i];
                                    teacher = teachers[i];
                                    console.log("Fetching course details for course: ".concat(course));
                                    errMessage = "error while fetching course details";
                                    return [4 /*yield*/, (0, course_1.peekCourse)(token, course, semester)];
                                case 1:
                                    courseResponse = _g.sent();
                                    if (courseResponse.status !== statusCodes_1.statusCodes.OK || !courseResponse.course) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                    }
                                    console.log("Fetching teacher details for teacher: ".concat(teacher));
                                    errMessage = "error while fetching teacher details";
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, teacher)];
                                case 2:
                                    teacherResponse = _g.sent();
                                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                    }
                                    bestScore = (0, common_1.scoreTeachers)(teacherResponse.teacher.timetable, teacherResponse.teacher.labtable);
                                    currRoomInfo = null;
                                    errMessage = "failed to create Preferred room";
                                    if (!preferredRooms) {
                                        maxNonNegativeEntries = -1;
                                        for (_i = 0, roomsInfo_1 = roomsInfo; _i < roomsInfo_1.length; _i++) {
                                            roomInfo = roomsInfo_1[_i];
                                            if (roomInfo) {
                                                roomScore = (0, common_1.scoreRooms)(roomInfo.timetable);
                                                nonNegativeEntries = 0;
                                                for (i_1 = 0; i_1 < roomScore.length; i_1++) {
                                                    for (j = 0; j < roomScore[i_1].length; j++) {
                                                        if (roomScore[i_1][j] >= 0) {
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
                                    errMessage = "failed to allocate room";
                                    if (roomsInfo && rooms[i] != '0') {
                                        currRoomInfo = roomsInfo.find(function (room) { return (room === null || room === void 0 ? void 0 : room.name) === rooms[i]; });
                                        if (!currRoomInfo) {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                        }
                                        feasible = (0, common_1.scoreRooms)(currRoomInfo.timetable);
                                        for (i_2 = 0; i_2 < feasible.length; i_2++) {
                                            for (j = 0; j < feasible[i_2].length; j++) {
                                                if (feasible[i_2][j] < 0) {
                                                    bestScore[i_2][j] = -1;
                                                }
                                            }
                                        }
                                        availableSlots = 0;
                                        for (i_3 = 0; i_3 < bestScore.length; i_3++) {
                                            if (bestScore[i_3].some(function (score) { return score > 0; })) {
                                                availableSlots++;
                                            }
                                        }
                                        if ((_a = courseResponse.course) === null || _a === void 0 ? void 0 : _a.credits) {
                                            for (i_4 = 0; i_4 < bestScore.length; i_4++) {
                                                for (j = 0; j < bestScore[i_4].length; j++) {
                                                    if (bestScore[i_4][j] > 0) {
                                                        bestScore[i_4][j] = (bestScore[i_4][j] + randomFactor * Math.random()) / bFactor[i_4];
                                                    }
                                                }
                                            }
                                            for (k = 0; k < Math.min(courseResponse.course.credits, availableSlots); k++) {
                                                sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                    .sort(function (a, b) { return b.score - a.score; });
                                                index = sortedScores[k].index;
                                                row = Math.floor(index / bestScore[0].length);
                                                col = index % bestScore[0].length;
                                                timetable[row][col] = courseResponse.course.name;
                                                roomtable[row][col] = currRoomInfo.name;
                                                bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                                                for (j = 0; j < bestScore[i].length; j++) {
                                                    bestScore[row][j] = -1;
                                                }
                                            }
                                            if (availableSlots < ((_b = courseResponse.course) === null || _b === void 0 ? void 0 : _b.credits)) {
                                                return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: roomtable } } }];
                                            }
                                        }
                                        else {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                        }
                                    }
                                    else {
                                        bestScoreCopy = bestScore;
                                        preferredRoomInfo = roomsInfo.find(function (room) { return (room === null || room === void 0 ? void 0 : room.name) === preferredRooms; });
                                        if (!preferredRoomInfo) {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                        }
                                        feasible = (0, common_1.scoreRooms)(preferredRoomInfo.timetable);
                                        for (i_5 = 0; i_5 < feasible.length; i_5++) {
                                            for (j = 0; j < feasible[i_5].length; j++) {
                                                if (feasible[i_5][j] < 0) {
                                                    bestScore[i_5][j] = -1;
                                                }
                                            }
                                        }
                                        for (i_6 = 0; i_6 < timetable.length; i_6++) {
                                            for (j = 0; j < timetable[i_6].length; j++) {
                                                if (timetable[i_6][j] !== '0') {
                                                    bestScore[i_6][j] = -1;
                                                    bestScoreCopy[i_6][j] = -1;
                                                }
                                            }
                                        }
                                        availableSlots = 0;
                                        for (i_7 = 0; i_7 < bestScore.length; i_7++) {
                                            if (bestScore[i_7].some(function (score) { return score > 0; })) {
                                                availableSlots++;
                                            }
                                        }
                                        if ((_c = courseResponse.course) === null || _c === void 0 ? void 0 : _c.credits) {
                                            if (availableSlots < ((_d = courseResponse.course) === null || _d === void 0 ? void 0 : _d.credits)) {
                                                for (k = 0; k < availableSlots; k++) {
                                                    sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                        .sort(function (a, b) { return b.score - a.score; });
                                                    index = sortedScores[k].index;
                                                    row = Math.floor(index / bestScore[0].length);
                                                    col = index % bestScore[0].length;
                                                    timetable[row][col] = courseResponse.course.name;
                                                    roomtable[row][col] = preferredRoomInfo.name;
                                                    for (i_8 = 0; i_8 < bestScoreCopy[row].length; i_8++) {
                                                        bestScoreCopy[row][i_8] = -1;
                                                    }
                                                }
                                                remainingCredits = courseResponse.course.credits - availableSlots;
                                                for (_f = 0, roomsInfo_2 = roomsInfo; _f < roomsInfo_2.length; _f++) {
                                                    roomInfo = roomsInfo_2[_f];
                                                    if (remainingCredits <= 0)
                                                        break;
                                                    if (roomInfo && roomInfo.name !== preferredRoomInfo.name) {
                                                        feasible_1 = (0, common_1.scoreRooms)(roomInfo.timetable);
                                                        bestScoreCopyCopy = bestScoreCopy;
                                                        for (i_9 = 0; i_9 < feasible_1.length; i_9++) {
                                                            for (j = 0; j < feasible_1[i_9].length; j++) {
                                                                if (feasible_1[i_9][j] < 0) {
                                                                    bestScoreCopyCopy[i_9][j] = -1;
                                                                }
                                                            }
                                                        }
                                                        availableSlots_1 = 0;
                                                        for (i_10 = 0; i_10 < bestScore.length; i_10++) {
                                                            if (bestScoreCopyCopy[i_10].some(function (score) { return score > 0; })) {
                                                                availableSlots_1++;
                                                            }
                                                        }
                                                        if (availableSlots_1 >= remainingCredits) {
                                                            sortedScores = bestScoreCopyCopy.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                                .sort(function (a, b) { return b.score - a.score; });
                                                            for (k = 0; k < remainingCredits; k++) {
                                                                index = sortedScores[k].index;
                                                                row = Math.floor(index / bestScoreCopyCopy[0].length);
                                                                col = index % bestScoreCopyCopy[0].length;
                                                                timetable[row][col] = courseResponse.course.name;
                                                                roomtable[row][col] = roomInfo.name;
                                                                for (i_11 = 0; i_11 < bestScoreCopyCopy[row].length; i_11++) {
                                                                    bestScoreCopyCopy[row][i_11] = -1;
                                                                }
                                                            }
                                                            remainingCredits = 0;
                                                        }
                                                    }
                                                }
                                                if (remainingCredits > 0)
                                                    return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } } }];
                                            }
                                            else {
                                                for (k = 0; k < courseResponse.course.credits; k++) {
                                                    sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                        .sort(function (a, b) { return b.score - a.score; });
                                                    index = sortedScores[k].index;
                                                    row = Math.floor(index / bestScore[0].length);
                                                    col = index % bestScore[0].length;
                                                    timetable[row][col] = courseResponse.course.name;
                                                    roomtable[row][col] = preferredRoomInfo.name;
                                                    for (i_12 = 0; i_12 < bestScore[row].length; i_12++) {
                                                        bestScore[row][i_12] = -1;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null } } }];
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _e.label = 4;
                case 4:
                    if (!(i < courses.length)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1(i)];
                case 5:
                    state_1 = _e.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _e.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } }];
                case 8:
                    error_1 = _e.sent();
                    console.error(error_1);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null } }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function recommendCourse(token, teacher, room, blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var timetable, errMessage, score, j, k, _a, status_1, teacherData, scoreValue, i, j, _b, status_2, roomData, scoreValue, i, j, i, j, maxScore, i, j, i, j, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    timetable = (0, common_1.convertStringToTable)(blocks);
                    errMessage = "";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    score = Array(6).fill(0).map(function () { return Array(6).fill(0); });
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
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, teacher)];
                case 2:
                    _a = _d.sent(), status_1 = _a.status, teacherData = _a.teacher;
                    if (status_1 == statusCodes_1.statusCodes.OK && teacherData) {
                        scoreValue = (0, common_1.scoreTeachers)(teacherData.timetable, teacherData.labtable);
                        for (i = 0; i < scoreValue.length; i++) {
                            for (j = 0; j < scoreValue[i].length; j++) {
                                if (scoreValue[i][j] < 0) {
                                    score[i][j] = -1;
                                }
                                else {
                                    if (score[i][j] >= 0)
                                        score[i][j] += scoreValue[i][j];
                                }
                            }
                        }
                    }
                    else {
                        return [2 /*return*/, {
                                status: status_1,
                                timetable: errMessage
                            }];
                    }
                    if (!room) return [3 /*break*/, 4];
                    errMessage = "error when accessing room";
                    return [4 /*yield*/, (0, room_1.peekRoom)(token, room)];
                case 3:
                    _b = _d.sent(), status_2 = _b.status, roomData = _b.room;
                    if (status_2 == statusCodes_1.statusCodes.OK && roomData) {
                        scoreValue = (0, common_1.scoreRooms)(roomData.timetable);
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
                                status: status_2,
                                timetable: errMessage
                            }];
                    }
                    _d.label = 4;
                case 4:
                    if (!score) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                timetable: "score is null"
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
                            timetable: (0, common_1.convertTableToString)(score.map(function (row) { return row.map(function (val) { return val.toString(); }); }))
                        }];
                case 5:
                    _c = _d.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            timetable: errMessage
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function saveTimetable(JWTtoken, name, batch, courses, teachers, rooms, electives, labs, semester, defaultRooms, timetable, roomTimetable) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_3, user, Section, duplicates, department, newCourse, tt, i, j, tCourse, k, tTeacher, teacherResponse, tTeacherTT, updateteacher, roomTT, i, j, existingRoom, TT, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 22, , 23]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_3 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    if (!(status_3 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 21];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 20];
                    Section = {
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
                    return [4 /*yield*/, prisma.section.findFirst({
                            where: {
                                orgId: Section.orgId,
                                name: name,
                                batch: batch
                            },
                        })];
                case 2:
                    duplicates = _b.sent();
                    if (duplicates || (courses.length !== teachers.length) || courses.length !== rooms.length) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    department = user.department;
                    return [4 /*yield*/, prisma.section.create({
                            data: Section,
                        })];
                case 3:
                    newCourse = _b.sent();
                    tt = (0, common_1.convertStringToTable)(timetable);
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < tt.length)) return [3 /*break*/, 12];
                    j = 0;
                    _b.label = 5;
                case 5:
                    if (!(j < tt[i].length)) return [3 /*break*/, 11];
                    if (!(tt[i][j] !== "0")) return [3 /*break*/, 10];
                    tCourse = tt[i][j];
                    k = 0;
                    _b.label = 6;
                case 6:
                    if (!(k < courses.length)) return [3 /*break*/, 10];
                    if (!(tCourse == courses[k])) return [3 /*break*/, 9];
                    tTeacher = teachers[k];
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(JWTtoken, tTeacher, department)];
                case 7:
                    teacherResponse = _b.sent();
                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                    }
                    tTeacherTT = (0, common_1.convertStringToTable)(teacherResponse.teacher.timetable);
                    tTeacherTT[i][j] = name;
                    teacherResponse.teacher.timetable = (0, common_1.convertTableToString)(tTeacherTT);
                    return [4 /*yield*/, (0, teacher_1.updateTeachers)(JWTtoken, tTeacher, department, teacherResponse.teacher)];
                case 8:
                    updateteacher = _b.sent();
                    if (updateteacher.status !== statusCodes_1.statusCodes.OK || !updateteacher.teacher) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                    }
                    return [3 /*break*/, 10];
                case 9:
                    k++;
                    return [3 /*break*/, 6];
                case 10:
                    j++;
                    return [3 /*break*/, 5];
                case 11:
                    i++;
                    return [3 /*break*/, 4];
                case 12:
                    roomTT = (0, common_1.convertStringToTable)(roomTimetable);
                    console.log(roomTT);
                    i = 0;
                    _b.label = 13;
                case 13:
                    if (!(i < roomTT.length)) return [3 /*break*/, 19];
                    j = 0;
                    _b.label = 14;
                case 14:
                    if (!(j < roomTT[i].length)) return [3 /*break*/, 18];
                    if (!(roomTT[i][j] !== "0")) return [3 /*break*/, 17];
                    return [4 /*yield*/, prisma.room.findFirst({
                            where: {
                                orgId: user.orgId,
                                department: user.role = department,
                                name: roomTT[i][j],
                            },
                        })];
                case 15:
                    existingRoom = _b.sent();
                    if (!existingRoom) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                            }];
                    }
                    TT = (0, common_1.convertStringToTable)(existingRoom.timetable);
                    TT[i][j] = name;
                    return [4 /*yield*/, prisma.room.update({
                            where: {
                                id: existingRoom.id,
                            },
                            data: {
                                timetable: (0, common_1.convertTableToString)(TT),
                            },
                        })];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    j++;
                    return [3 /*break*/, 14];
                case 18:
                    i++;
                    return [3 /*break*/, 13];
                case 19: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                    }];
                case 20: 
                // If role is viewer
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN
                    }];
                case 21: 
                // If status is not OK
                return [2 /*return*/, {
                        status: status_3,
                    }];
                case 22:
                    e_1 = _b.sent();
                    console.error(e_1);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR
                        }];
                case 23: return [2 /*return*/];
            }
        });
    });
}
function getTimetable(JWTtoken, semester) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, section, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_4 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                section: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.section.findMany({
                            where: {
                                orgId: user.orgId,
                                semester: semester,
                            },
                            select: {
                                id: true,
                                name: true,
                                batch: true,
                                courses: true,
                                teachers: true,
                                rooms: true,
                                semester: true,
                                orgId: true,
                                timeTable: true,
                            },
                        })];
                case 2:
                    section = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            section: section,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_4,
                        section: null,
                    }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            section: null,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteSection(JWTtoken, id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_5, user, section, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.section.deleteMany({
                            where: {
                                orgId: user.orgId,
                                id: id
                            },
                        })];
                case 2:
                    section = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_5,
                    }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// export async function suggestLab(
// ){
// }

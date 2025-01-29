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
exports.peekTimetable = peekTimetable;
exports.updateTimetable = updateTimetable;
exports.createTemptable = createTemptable;
exports.peekTempTable = peekTempTable;
exports.deleteTempTable = deleteTempTable;
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
var endFactor = 0.0025;
function suggestTimetable(token, block, courses, teachers, rooms, semester, preferredRooms) {
    return __awaiter(this, void 0, void 0, function () {
        var errMessage, blocks, timetable, display, roomtable, departmentRoomsResponse, flag_1, roomsInfo, bFactor, _loop_1, i, state_1, error_1;
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
                    display = blocks.map(function (row) { return row.map(function (cell) { return cell !== '0' ? cell : '0'; }); });
                    roomtable = Array(6).fill(0).map(function () { return Array(6).fill('0'); });
                    console.log("Fetching department rooms");
                    errMessage = "error while fetching department rooms";
                    return [4 /*yield*/, (0, room_1.getRooms)(token)];
                case 2:
                    departmentRoomsResponse = _e.sent();
                    if (departmentRoomsResponse.status !== statusCodes_1.statusCodes.OK || !departmentRoomsResponse.rooms) {
                        return [2 /*return*/, { status: departmentRoomsResponse.status, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } }];
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
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } }];
                    }
                    bFactor = Array(6).fill(1);
                    _loop_1 = function (i) {
                        var course, teacher, courseResponse, teacherResponse, bestScore, currRoomInfo, maxNonNegativeEntries, _i, roomsInfo_1, roomInfo, roomScore, nonNegativeEntries, i_1, j, feasible, i_2, j, availableSlots, i_3, i_4, j, k, sortedScores, index, row, col, j, bestScoreCopy, preferredRoomInfo, feasible, i_5, j, i_6, j, i_7, j, availableSlots, i_8, k, sortedScores, index, row, col, i_9, remainingCredits, _f, roomsInfo_2, roomInfo, feasible_1, bestScoreCopyCopy, i_10, j, availableSlots_1, i_11, sortedScores, k, index, row, col, i_12, k, sortedScores, index, row, col, i_13;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    console.log("bFactor: ", bFactor);
                                    course = courses[i];
                                    teacher = teachers[i];
                                    console.log("Fetching course details for course: ".concat(course));
                                    errMessage = "error while fetching course details";
                                    return [4 /*yield*/, (0, course_1.peekCourse)(token, course, semester)];
                                case 1:
                                    courseResponse = _g.sent();
                                    if (courseResponse.status !== statusCodes_1.statusCodes.OK || !courseResponse.course) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
                                    }
                                    console.log("Fetching teacher details for teacher: ".concat(teacher));
                                    errMessage = "error while fetching teacher details";
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, teacher)];
                                case 2:
                                    teacherResponse = _g.sent();
                                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
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
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
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
                                        console.log("bFactor: ", bFactor);
                                        if ((_a = courseResponse.course) === null || _a === void 0 ? void 0 : _a.credits) {
                                            for (i_4 = 0; i_4 < bestScore.length; i_4++) {
                                                for (j = 0; j < bestScore[i_4].length; j++) {
                                                    if (bestScore[i_4][j] > 0) {
                                                        bestScore[i_4][j] = (bestScore[i_4][j] + randomFactor * Math.random()) / bFactor[i_4] * (1 - j * endFactor / 6);
                                                    }
                                                }
                                            }
                                            console.log("Matrix after random and bfactor: ", bestScore);
                                            for (k = 0; k < Math.min(courseResponse.course.credits, availableSlots); k++) {
                                                sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                    .sort(function (a, b) { return b.score - a.score; });
                                                index = sortedScores[k].index;
                                                row = Math.floor(index / bestScore[0].length);
                                                col = index % bestScore[0].length;
                                                timetable[row][col] = courseResponse.course.name;
                                                roomtable[row][col] = currRoomInfo.name;
                                                display[row][col] = courseResponse.course.code;
                                                bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                                                for (j = 0; j < bestScore[i].length; j++) {
                                                    bestScore[row][j] = -1;
                                                }
                                            }
                                            if (availableSlots < ((_b = courseResponse.course) === null || _b === void 0 ? void 0 : _b.credits)) {
                                                return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: roomtable, display: display } } }];
                                            }
                                        }
                                        else {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
                                        }
                                    }
                                    else {
                                        bestScoreCopy = bestScore;
                                        preferredRoomInfo = roomsInfo.find(function (room) { return (room === null || room === void 0 ? void 0 : room.name) === preferredRooms; });
                                        if (!preferredRoomInfo) {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
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
                                        for (i_7 = 0; i_7 < bestScore.length; i_7++) {
                                            for (j = 0; j < bestScore[i_7].length; j++) {
                                                if (bestScore[i_7][j] > 0) {
                                                    bestScore[i_7][j] = (bestScore[i_7][j] + randomFactor * Math.random()) / bFactor[i_7] * (1 - j * endFactor / 6);
                                                }
                                            }
                                        }
                                        availableSlots = 0;
                                        for (i_8 = 0; i_8 < bestScore.length; i_8++) {
                                            if (bestScore[i_8].some(function (score) { return score > 0; })) {
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
                                                    display[row][col] = courseResponse.course.code;
                                                    bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                                                    for (i_9 = 0; i_9 < bestScoreCopy[row].length; i_9++) {
                                                        bestScoreCopy[row][i_9] = -1;
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
                                                        for (i_10 = 0; i_10 < feasible_1.length; i_10++) {
                                                            for (j = 0; j < feasible_1[i_10].length; j++) {
                                                                if (feasible_1[i_10][j] < 0) {
                                                                    bestScoreCopyCopy[i_10][j] = -1;
                                                                }
                                                            }
                                                        }
                                                        availableSlots_1 = 0;
                                                        for (i_11 = 0; i_11 < bestScore.length; i_11++) {
                                                            if (bestScoreCopyCopy[i_11].some(function (score) { return score > 0; })) {
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
                                                                display[row][col] = courseResponse.course.code;
                                                                bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                                                                for (i_12 = 0; i_12 < bestScoreCopyCopy[row].length; i_12++) {
                                                                    bestScoreCopyCopy[row][i_12] = -1;
                                                                }
                                                            }
                                                            remainingCredits = 0;
                                                        }
                                                    }
                                                }
                                                if (remainingCredits > 0)
                                                    return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null, display: null } } }];
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
                                                    display[row][col] = courseResponse.course.code;
                                                    bFactor[row] = bFactor[row] + courseResponse.course.bFactor;
                                                    for (i_13 = 0; i_13 < bestScore[row].length; i_13++) {
                                                        bestScore[row][i_13] = -1;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } } }];
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
                case 7:
                    console.log(roomtable);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable, display: display } }];
                case 8:
                    error_1 = _e.sent();
                    console.error(error_1);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: { timetable: [[errMessage]], roomtable: null, display: null } }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function recommendCourse(token, teacher, room, blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var timetable, errMessage, score, j, k, _a, status_1, teacherData, scoreValue, i, j, _b, status_2, roomData, scoreValue, i, j, maxScore, i, j, _c;
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
                    console.log("Accessible parts considering the current timetable: ");
                    errMessage = "error accessing teacher";
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, teacher)];
                case 2:
                    _a = _d.sent(), status_1 = _a.status, teacherData = _a.teacher;
                    if (status_1 == statusCodes_1.statusCodes.OK && teacherData) {
                        console.log("teacher timetable: ", (0, common_1.scoreTeachers)(teacherData.timetable, teacherData.labtable));
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
                    console.log("after merging", score);
                    if (!room) return [3 /*break*/, 4];
                    errMessage = "error when accessing room";
                    return [4 /*yield*/, (0, room_1.peekRoom)(token, room)];
                case 3:
                    _b = _d.sent(), status_2 = _b.status, roomData = _b.room;
                    if (status_2 == statusCodes_1.statusCodes.OK && roomData) {
                        console.log("accessing room tt of: ", roomData.name);
                        console.log("timetable of the room: ", roomData.timetable);
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
                    console.log("after merging with room: ", score);
                    if (!score) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                timetable: "score is null"
                            }];
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
function saveTimetable(JWTtoken, name, courses, teachers, rooms, electives, labs, semester, defaultRooms, timetable, roomTimetable, courseTimetable) {
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
                        orgId: user.orgId,
                        courses: courses,
                        teachers: teachers,
                        rooms: rooms,
                        elective: electives,
                        lab: labs,
                        defaultRoom: defaultRooms,
                        semester: semester,
                        timeTable: timetable,
                        roomTable: roomTimetable,
                        courseTable: courseTimetable
                    };
                    return [4 /*yield*/, prisma.section.findFirst({
                            where: {
                                orgId: Section.orgId,
                                name: name,
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
                    console.log(tTeacher);
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
                    console.log(updateteacher.teacher);
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
        var _a, status_4, user, section, tempSections, _i, tempSections_1, tempSection, teacherCourses, courses, teachers, rooms, _b, teacherCourses_1, tc, _c, teacher, course, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _d.sent(), status_4 = _a.status, user = _a.user;
                    section = void 0;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                section: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.section.findMany({
                            where: {
                                orgId: user.orgId,
                                semester: semester,
                            },
                            select: {
                                id: true,
                                name: true,
                                courses: true,
                                teachers: true,
                                rooms: true
                            },
                        })];
                case 2:
                    section = _d.sent();
                    console.log("section found", section);
                    return [4 /*yield*/, prisma.tempSection.findMany({
                            where: {
                                orgId: user.orgId,
                                semester: semester,
                            }
                        })];
                case 3:
                    tempSections = _d.sent();
                    console.log("temps Found:", tempSections);
                    for (_i = 0, tempSections_1 = tempSections; _i < tempSections_1.length; _i++) {
                        tempSection = tempSections_1[_i];
                        teacherCourses = tempSection.teacherCourse.split(',');
                        courses = [];
                        teachers = [];
                        rooms = [];
                        for (_b = 0, teacherCourses_1 = teacherCourses; _b < teacherCourses_1.length; _b++) {
                            tc = teacherCourses_1[_b];
                            _c = tc.split('-'), teacher = _c[0], course = _c[1];
                            teachers.push(teacher);
                            courses.push(course);
                            rooms.push('0');
                        }
                        section.push({
                            id: tempSection.id,
                            name: tempSection.name + '(Temporary)',
                            courses: courses,
                            teachers: teachers,
                            rooms: rooms,
                            temporary: true
                        });
                    }
                    // console.log("tempSections: ")
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            section: section,
                        }];
                case 4: return [2 /*return*/, {
                        status: status_4,
                        section: null,
                    }];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _d.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            section: null,
                        }];
                case 7: return [2 /*return*/];
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
function peekTimetable(JWTtoken, id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_6, user, section, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_6 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                section: null,
                            }];
                    }
                    if (!(status_6 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.section.findFirst({
                            where: {
                                orgId: user.orgId,
                                id: id
                            },
                            select: {
                                id: true,
                                name: true,
                                courses: true,
                                teachers: true,
                                rooms: true,
                                elective: true,
                                lab: true,
                                defaultRoom: true,
                                timeTable: true,
                                roomTable: true,
                                courseTable: true
                            }
                        })];
                case 2:
                    section = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            section: section
                        }];
                case 3: return [2 /*return*/, {
                        status: status_6,
                        section: null,
                    }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            section: null,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function updateTimetable(JWTtoken, id, oldname, section, teachers, rooms) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_7, user_1, existingSection, updatedSection, department, tt, i, j, tCourse, k, tTeacher, teacherResponse, tTeacherTT, updateteacher, roomTT, i, j, existingRoom, TT, error_5;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 21, , 22]);
                    console.log("Section i got", section);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_7 = _a.status, user_1 = _a.user;
                    if ((user_1 === null || user_1 === void 0 ? void 0 : user_1.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    if (!(status_7 == statusCodes_1.statusCodes.OK && user_1 && user_1.role != "viewer")) return [3 /*break*/, 20];
                    return [4 /*yield*/, prisma.section.findFirst({
                            where: {
                                id: id,
                                orgId: user_1.orgId,
                            },
                        })];
                case 2:
                    existingSection = _b.sent();
                    if (!existingSection) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.NOT_FOUND }];
                    }
                    return [4 /*yield*/, prisma.section.update({
                            where: { id: existingSection.id },
                            data: {
                                name: section.name,
                                courses: section.courses,
                                teachers: section.teachers,
                                rooms: section.rooms,
                                elective: section.elective,
                                semester: section.semester,
                                lab: section.lab,
                                defaultRoom: section.defaultRoom,
                                timeTable: section.timeTable,
                                roomTable: section.roomTable,
                                courseTable: section.courseTable
                            },
                        })];
                case 3:
                    updatedSection = _b.sent();
                    console.log("updated Sections", updatedSection);
                    //Deleting from old teachers
                    teachers.forEach(function (teacher) { return __awaiter(_this, void 0, void 0, function () {
                        var teacherResponse, tTeacherTT, i, j, updateteacher;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("teacher", teacher);
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(JWTtoken, teacher, user_1.department)];
                                case 1:
                                    teacherResponse = _a.sent();
                                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                                    }
                                    tTeacherTT = (0, common_1.convertStringToTable)(teacherResponse.teacher.timetable);
                                    for (i = 0; i < tTeacherTT.length; i++) {
                                        for (j = 0; j < tTeacherTT[i].length; j++) {
                                            if (tTeacherTT[i][j] === oldname) {
                                                tTeacherTT[i][j] = "Free";
                                            }
                                        }
                                    }
                                    teacherResponse.teacher.timetable = (0, common_1.convertTableToString)(tTeacherTT);
                                    return [4 /*yield*/, (0, teacher_1.updateTeachers)(JWTtoken, teacher, user_1.department, teacherResponse.teacher)];
                                case 2:
                                    updateteacher = _a.sent();
                                    if (updateteacher.status !== statusCodes_1.statusCodes.OK || !updateteacher.teacher) {
                                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    //Deleting from old rooms
                    rooms.forEach(function (room) { return __awaiter(_this, void 0, void 0, function () {
                        var roomResponse, TT, i, j, updateroom;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, room_1.peekRoom)(JWTtoken, room, user_1.department)];
                                case 1:
                                    roomResponse = _a.sent();
                                    if (roomResponse.status !== statusCodes_1.statusCodes.OK || !roomResponse.room) {
                                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                                    }
                                    TT = (0, common_1.convertStringToTable)(roomResponse.room.timetable);
                                    for (i = 0; i < TT.length; i++) {
                                        for (j = 0; j < TT[i].length; j++) {
                                            if (TT[i][j] === oldname) {
                                                TT[i][j] = "Free";
                                            }
                                        }
                                    }
                                    roomResponse.room.timetable = (0, common_1.convertTableToString)(TT);
                                    return [4 /*yield*/, (0, room_1.updateRoom)(JWTtoken, room, user_1.department, roomResponse.room)];
                                case 2:
                                    updateroom = _a.sent();
                                    if (updateroom.status !== statusCodes_1.statusCodes.OK) {
                                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    department = user_1.department;
                    tt = (0, common_1.convertStringToTable)(section.timeTable);
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
                    if (!(k < section.courses.length)) return [3 /*break*/, 10];
                    if (!(tCourse == section.courses[k])) return [3 /*break*/, 9];
                    tTeacher = section.teachers[k];
                    console.log(tTeacher);
                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(JWTtoken, tTeacher, department)];
                case 7:
                    teacherResponse = _b.sent();
                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                    }
                    tTeacherTT = (0, common_1.convertStringToTable)(teacherResponse.teacher.timetable);
                    tTeacherTT[i][j] = section.name;
                    teacherResponse.teacher.timetable = (0, common_1.convertTableToString)(tTeacherTT);
                    return [4 /*yield*/, (0, teacher_1.updateTeachers)(JWTtoken, tTeacher, department, teacherResponse.teacher)];
                case 8:
                    updateteacher = _b.sent();
                    if (updateteacher.status !== statusCodes_1.statusCodes.OK || !updateteacher.teacher) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                    }
                    console.log(updateteacher.teacher);
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
                    roomTT = (0, common_1.convertStringToTable)(section.roomTable);
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
                                orgId: user_1.orgId,
                                department: user_1.role = department,
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
                    TT[i][j] = section.name;
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
                case 19: return [2 /*return*/, { status: statusCodes_1.statusCodes.OK }];
                case 20: return [2 /*return*/, {
                        status: status_7 == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.FORBIDDEN : status_7,
                    }];
                case 21:
                    error_5 = _b.sent();
                    console.error(error_5);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                case 22: return [2 /*return*/];
            }
        });
    });
}
function createTemptable(JWTtoken, data) {
    return __awaiter(this, void 0, void 0, function () {
        var errMessage, user, tempSection, _loop_2, _i, data_1, teacher, error_6, _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    errMessage = "Call to createTemptable failed";
                    console.log("bande");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 2:
                    user = _e.sent();
                    tempSection = [];
                    if (user.status !== statusCodes_1.statusCodes.OK) {
                        return [2 /*return*/, {
                                status: user.status,
                                returnVal: "Error while fetching user details"
                            }];
                    }
                    if (!((_b = user.user) === null || _b === void 0 ? void 0 : _b.orgId)) return [3 /*break*/, 6];
                    errMessage = "failed to find temporary sections";
                    _loop_2 = function (teacher) {
                        var _loop_3 = function (i) {
                            var existingSection = tempSection.find(function (section) {
                                return section.name === teacher.sections[i] &&
                                    section.semester === teacher.semesters[i];
                            });
                            if (!existingSection) {
                                tempSection.push({
                                    name: teacher.sections[i],
                                    semester: teacher.semesters[i],
                                    orgId: (_c = user.user) === null || _c === void 0 ? void 0 : _c.orgId,
                                    department: (_d = user.user) === null || _d === void 0 ? void 0 : _d.department,
                                    teacherCourse: "".concat(teacher.teacherInitials, "-").concat(teacher.courseCodes[i])
                                });
                            }
                            else {
                                if (existingSection) {
                                    existingSection.teacherCourse += ",".concat(teacher.teacherInitials, "-").concat(teacher.courseCodes[i]);
                                }
                            }
                        };
                        for (var i = 0; i < teacher.sections.length; i++) {
                            _loop_3(i);
                        }
                    };
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        teacher = data_1[_i];
                        _loop_2(teacher);
                    }
                    errMessage = "Failed to update temporary Sections locally";
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    // Delete existing entries for this organization
                    // for (const section of tempSection) {
                    //     await prisma.tempSection.deleteMany({
                    //         where: {
                    //         orgId: user.user.orgId,
                    //         department: user.user.department,
                    //         name: section.name,
                    //         semester: section.semester || 0
                    //         }
                    //     });
                    // }
                    // Create new entries
                    return [4 /*yield*/, prisma.tempSection.createMany({
                            data: tempSection,
                            skipDuplicates: true
                        })];
                case 4:
                    // Delete existing entries for this organization
                    // for (const section of tempSection) {
                    //     await prisma.tempSection.deleteMany({
                    //         where: {
                    //         orgId: user.user.orgId,
                    //         department: user.user.department,
                    //         name: section.name,
                    //         semester: section.semester || 0
                    //         }
                    //     });
                    // }
                    // Create new entries
                    _e.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            returnVal: "Done!"
                        }];
                case 5:
                    error_6 = _e.sent();
                    console.error(error_6);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            returnVal: "Failed to update database with temporary sections"
                        }];
                case 6: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        returnVal: "User details not found"
                    }];
                case 7:
                    _a = _e.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            returnVal: errMessage
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function peekTempTable(token, id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, user, retVal, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, auth.getPosition(token)];
                case 1:
                    _a = _b.sent(), status = _a.status, user = _a.user;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    if (!(status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId))) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.tempSection.findUnique({
                            where: {
                                orgId: user.orgId,
                                id: id
                            }
                        })];
                case 3:
                    retVal = _b.sent();
                    console.log("Retval: ", retVal);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            retVal: retVal
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.UNAUTHORIZED,
                        retVal: "User not eligible to make this decsion"
                    }];
                case 5:
                    e_2 = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            retVal: e_2
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteTempTable(JWTtoken, id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_8, user, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_8 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    if (!(status_8 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.tempSection.deleteMany({
                            where: {
                                orgId: user.orgId,
                                id: id
                            },
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_8,
                    }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_7 = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}

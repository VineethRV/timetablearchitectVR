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
var course_1 = require("../actions/course");
var room_1 = require("../actions/room");
var teacher_1 = require("../actions/teacher");
var statusCodes_1 = require("../types/statusCodes");
var common_1 = require("./common");
function suggestTimetable(token, block, courses, teachers, rooms, semester, preferredRooms) {
    return __awaiter(this, void 0, void 0, function () {
        var blocks, timetable, roomtable, departmentRoomsResponse, flag_1, roomsInfo, _loop_1, i, state_1, error_1;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    blocks = (0, common_1.convertStringToTable)(block);
                    timetable = blocks.map(function (row) { return row.map(function (cell) { return cell !== '0' ? cell : '0'; }); });
                    roomtable = blocks.map(function (row) { return row.map(function (cell) { return cell !== '0' ? '-' : '0'; }); });
                    return [4 /*yield*/, (0, room_1.getRooms)(token)];
                case 1:
                    departmentRoomsResponse = _e.sent();
                    if (departmentRoomsResponse.status !== statusCodes_1.statusCodes.OK || !departmentRoomsResponse.rooms) {
                        return [2 /*return*/, { status: departmentRoomsResponse.status, returnVal: null }];
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
                case 2:
                    roomsInfo = _e.sent();
                    if (flag_1 == 1) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null }];
                    }
                    _loop_1 = function (i) {
                        var course, teacher, courseResponse, teacherResponse, bestScore, currRoomInfo, maxNonNegativeEntries, _i, roomsInfo_1, roomInfo, roomScore, nonNegativeEntries, i_1, j, feasible, i_2, j, availableSlots, sortedScores, k, index, row, col, bestScoreCopy, preferredRoomInfo, feasible, i_3, j, i_4, j, availableSlots, sortedScores, k, index, row, col, remainingCredits, _f, roomsInfo_2, roomInfo, feasible_1, bestScoreCopyCopy, i_5, j, availableSlots_1, sortedScores_1, k, index, row, col, k, index, row, col;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    course = courses[i];
                                    teacher = teachers[i];
                                    return [4 /*yield*/, (0, course_1.peekCourse)(token, course, semester)];
                                case 1:
                                    courseResponse = _g.sent();
                                    if (courseResponse.status !== statusCodes_1.statusCodes.OK || !courseResponse.course) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null } }];
                                    }
                                    return [4 /*yield*/, (0, teacher_1.peekTeacher)(token, teacher)];
                                case 2:
                                    teacherResponse = _g.sent();
                                    if (teacherResponse.status !== statusCodes_1.statusCodes.OK || !teacherResponse.teacher) {
                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null } }];
                                    }
                                    bestScore = (0, common_1.scoreTeachers)(teacherResponse.teacher.timetable, teacherResponse.teacher.labtable);
                                    currRoomInfo = null;
                                    //create a default room.
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
                                    // Retrieve room details
                                    //check if specified room is a department name or room name
                                    //following if statement checks if the specified room is a room (if yes, code is allowed inside)
                                    if (roomsInfo && rooms[i] != '0') {
                                        currRoomInfo = roomsInfo.find(function (room) { return (room === null || room === void 0 ? void 0 : room.name) === rooms[i]; });
                                        if (!currRoomInfo) {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null } }];
                                        }
                                        else {
                                            feasible = (0, common_1.scoreRooms)(currRoomInfo.timetable);
                                            for (i_2 = 0; i_2 < feasible.length; i_2++) {
                                                for (j = 0; j < feasible[i_2].length; j++) {
                                                    if (feasible[i_2][j] < 0) {
                                                        bestScore[i_2][j] = -1;
                                                    }
                                                }
                                                availableSlots = bestScore.flat().filter(function (score) { return score > 0; }).length;
                                                if ((_a = courseResponse.course) === null || _a === void 0 ? void 0 : _a.credits) {
                                                    if (availableSlots < ((_b = courseResponse.course) === null || _b === void 0 ? void 0 : _b.credits)) {
                                                        return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.SERVICE_UNAVAILABLE, returnVal: { timetable: timetable, roomtable: null } } }];
                                                    }
                                                    else {
                                                        sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                            .sort(function (a, b) { return b.score - a.score; });
                                                        for (k = 0; k < courseResponse.course.credits; k++) {
                                                            index = sortedScores[k].index;
                                                            row = Math.floor(index / bestScore[0].length);
                                                            col = index % bestScore[0].length;
                                                            timetable[row][col] = courseResponse.course.name;
                                                            roomtable[row][col] = currRoomInfo.name;
                                                        }
                                                    }
                                                }
                                                else {
                                                    return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null } }];
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        bestScoreCopy = bestScore;
                                        preferredRoomInfo = roomsInfo.find(function (room) { return (room === null || room === void 0 ? void 0 : room.name) === preferredRooms; });
                                        if (!preferredRoomInfo) {
                                            return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null } }];
                                        }
                                        else {
                                            feasible = (0, common_1.scoreRooms)(preferredRoomInfo.timetable);
                                            for (i_3 = 0; i_3 < feasible.length; i_3++) {
                                                for (j = 0; j < feasible[i_3].length; j++) {
                                                    if (feasible[i_3][j] < 0) {
                                                        bestScore[i_3][j] = -1;
                                                    }
                                                }
                                            }
                                            for (i_4 = 0; i_4 < timetable.length; i_4++) {
                                                for (j = 0; j < timetable[i_4].length; j++) {
                                                    if (timetable[i_4][j] !== '0') {
                                                        bestScore[i_4][j] = -1;
                                                        bestScoreCopy[i_4][j] = -1;
                                                    }
                                                }
                                            }
                                            availableSlots = bestScore.flat().filter(function (score) { return score > 0; }).length;
                                            sortedScores = bestScore.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                .sort(function (a, b) { return b.score - a.score; });
                                            if ((_c = courseResponse.course) === null || _c === void 0 ? void 0 : _c.credits) {
                                                if (availableSlots < ((_d = courseResponse.course) === null || _d === void 0 ? void 0 : _d.credits)) {
                                                    for (k = 0; k < availableSlots; k++) {
                                                        index = sortedScores[k].index;
                                                        row = Math.floor(index / bestScore[0].length);
                                                        col = index % bestScore[0].length;
                                                        timetable[row][col] = courseResponse.course.name;
                                                        roomtable[row][col] = preferredRoomInfo.name;
                                                        bestScoreCopy[row][col] = -1;
                                                    }
                                                    remainingCredits = courseResponse.course.credits - availableSlots;
                                                    for (_f = 0, roomsInfo_2 = roomsInfo; _f < roomsInfo_2.length; _f++) {
                                                        roomInfo = roomsInfo_2[_f];
                                                        if (remainingCredits <= 0)
                                                            break;
                                                        if (roomInfo && roomInfo.name !== preferredRoomInfo.name) {
                                                            feasible_1 = (0, common_1.scoreRooms)(roomInfo.timetable);
                                                            bestScoreCopyCopy = bestScoreCopy;
                                                            for (i_5 = 0; i_5 < feasible_1.length; i_5++) {
                                                                for (j = 0; j < feasible_1[i_5].length; j++) {
                                                                    if (feasible_1[i_5][j] < 0) {
                                                                        bestScoreCopyCopy[i_5][j] = -1;
                                                                    }
                                                                }
                                                            }
                                                            availableSlots_1 = bestScoreCopyCopy.flat().filter(function (score) { return score > 0; }).length;
                                                            if (availableSlots_1 >= remainingCredits) {
                                                                sortedScores_1 = bestScoreCopyCopy.flat().map(function (score, index) { return ({ score: score, index: index }); })
                                                                    .sort(function (a, b) { return b.score - a.score; });
                                                                for (k = 0; k < remainingCredits; k++) {
                                                                    index = sortedScores_1[k].index;
                                                                    row = Math.floor(index / bestScoreCopyCopy[0].length);
                                                                    col = index % bestScoreCopyCopy[0].length;
                                                                    timetable[row][col] = courseResponse.course.name;
                                                                    roomtable[row][col] = roomInfo.name;
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
                                                        index = sortedScores[k].index;
                                                        row = Math.floor(index / bestScore[0].length);
                                                        col = index % bestScore[0].length;
                                                        timetable[row][col] = courseResponse.course.name;
                                                        roomtable[row][col] = preferredRoomInfo.name;
                                                    }
                                                }
                                            }
                                            else {
                                                return [2 /*return*/, { value: { status: statusCodes_1.statusCodes.BAD_REQUEST, returnVal: null } }];
                                            }
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _e.label = 3;
                case 3:
                    if (!(i < courses.length)) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_1(i)];
                case 4:
                    state_1 = _e.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _e.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, returnVal: { timetable: timetable, roomtable: roomtable } }];
                case 7:
                    error_1 = _e.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, returnVal: null }];
                case 8: return [2 /*return*/];
            }
        });
    });
}

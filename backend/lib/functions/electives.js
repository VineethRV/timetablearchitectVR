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
exports.timeslots = exports.weekdays = void 0;
exports.getIntersection = getIntersection;
var common_1 = require("./common");
var pgConnect_1 = require("../pgConnect");
exports.weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
exports.timeslots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30",
];
var prisma = pgConnect_1.default.getInstance().getPrismaClient();
function getIntersection(teachers, rooms) {
    return __awaiter(this, void 0, void 0, function () {
        var intersection_1, teacherObjects, roomObjects, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    intersection_1 = exports.weekdays.map(function () { return exports.timeslots.map(function () { return 0; }); });
                    if (!!(teachers.length === 1 && teachers[0] === "")) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma.teacher.findMany({
                            where: {
                                name: { in: teachers },
                            },
                            select: {
                                timetable: true,
                                labtable: true,
                            }
                        })];
                case 1:
                    teacherObjects = _a.sent();
                    teacherObjects.map(function (teacher) {
                        var teacherScore = (0, common_1.scoreTeachers)(teacher.timetable, teacher.labtable);
                        for (var i = 0; i < 6; i++) {
                            for (var j = 0; j < 6; j++) {
                                if (teacherScore[i][j] < 0) {
                                    intersection_1[i][j] = -1;
                                }
                                else if (intersection_1[i][j] >= 0) {
                                    intersection_1[i][j] += teacherScore[i][j];
                                }
                            }
                        }
                    });
                    console.log(teacherObjects);
                    console.log("intersection: ", intersection_1);
                    return [3 /*break*/, 3];
                case 2:
                    intersection_1.forEach(function (row, rowIndex) {
                        intersection_1[rowIndex] = row.map(function () { return 10; });
                    });
                    _a.label = 3;
                case 3:
                    if (!rooms) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.room.findMany({
                            where: {
                                name: { in: rooms },
                            },
                            select: {
                                timetable: true,
                            }
                        })];
                case 4:
                    roomObjects = _a.sent();
                    console.log(roomObjects);
                    roomObjects.map(function (room) {
                        var roomScore = (0, common_1.scoreRooms)(room.timetable);
                        for (var i = 0; i < 6; i++) {
                            for (var j = 0; j < 6; j++) {
                                if (roomScore[i][j] < 0) {
                                    intersection_1[i][j] = -1;
                                }
                            }
                        }
                    });
                    console.log("intersection: ", intersection_1);
                    _a.label = 5;
                case 5: return [2 /*return*/, { intersection: intersection_1, status: 200 }];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, { intersection: [], status: 500 }];
                case 7: return [2 /*return*/];
            }
        });
    });
}

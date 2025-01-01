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
exports.getTeacherPercentage = getTeacherPercentage;
exports.getRoomPercentage = getRoomPercentage;
exports.getLabPercentage = getLabPercentage;
var auth_1 = require("../actions/auth");
var statusCodes_1 = require("../types/statusCodes");
var client_1 = require("@prisma/client");
var common_1 = require("./common");
var prisma = new client_1.PrismaClient();
function getTeacherPercentage(token) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, user, rank, rankScore, department, teachers, totalPeriods_1, filledPeriods_1, percentage, teachers, totalPeriods_2, filledPeriods_2, percentage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.getPosition)(token)];
                case 1:
                    _a = _b.sent(), status = _a.status, user = _a.user;
                    rank = new Array(10).fill("");
                    rankScore = new Array(10).fill(0);
                    department = new Array(10).fill("");
                    console.log("token recieved\n");
                    if (!(status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId))) return [3 /*break*/, 6];
                    console.log("status ok\n");
                    if (!(user.role == 'admin')) return [3 /*break*/, 3];
                    console.log("admin\n");
                    return [4 /*yield*/, prisma.teacher
                            .findMany({
                            where: {
                                orgId: user.orgId,
                            },
                            select: {
                                department: true,
                                name: true,
                                timetable: true,
                                labtable: true,
                            },
                        })];
                case 2:
                    teachers = _b.sent();
                    totalPeriods_1 = 0;
                    filledPeriods_1 = 0;
                    teachers.forEach(function (teacher) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(teacher.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_1++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        var labtable = (0, common_1.convertStringToTable)(teacher.timetable);
                        labtable.forEach(function (day) {
                            day.forEach(function (period) {
                                if (period != '0')
                                    score++;
                            });
                        });
                        if ((36 - score) / 36 > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if ((36 - score) / 36 > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, teacher.name);
                                    department.splice(i, 0, teacher.department ? teacher.department : "");
                                    rankScore.pop();
                                    department.pop();
                                    rank.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_1 += score;
                    });
                    percentage = (filledPeriods_1 / totalPeriods_1) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: department
                        }];
                case 3: return [4 /*yield*/, prisma.teacher
                        .findMany({
                        where: {
                            orgId: user.orgId,
                            department: user.department,
                        },
                        select: {
                            name: true,
                            timetable: true,
                            labtable: true
                        },
                    })];
                case 4:
                    teachers = _b.sent();
                    totalPeriods_2 = 0;
                    filledPeriods_2 = 0;
                    teachers.forEach(function (teacher) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(teacher.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_2++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        var labtable = (0, common_1.convertStringToTable)(teacher.timetable);
                        labtable.forEach(function (day) {
                            day.forEach(function (period) {
                                if (period != '0')
                                    score++;
                            });
                        });
                        if ((36 - score) > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if ((36 - score) > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, teacher.name);
                                    rankScore.pop();
                                    rank.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_2 += score;
                    });
                    percentage = (filledPeriods_2 / totalPeriods_2) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: null
                        }];
                case 5: return [3 /*break*/, 7];
                case 6: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        percentage: 0,
                        rank: rank,
                        score: rankScore,
                        department: null
                    }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getRoomPercentage(token) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, user, rank, rankScore, department, rooms, totalPeriods_3, filledPeriods_3, percentage, rooms, totalPeriods_4, filledPeriods_4, percentage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.getPosition)(token)];
                case 1:
                    _a = _b.sent(), status = _a.status, user = _a.user;
                    rank = new Array(10).fill("");
                    rankScore = new Array(10).fill(0);
                    department = new Array(10).fill("");
                    if (!(status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId))) return [3 /*break*/, 6];
                    if (!(user.role == 'admin')) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.room.findMany({
                            where: {
                                orgId: user.orgId,
                                lab: false
                            },
                            select: {
                                name: true,
                                timetable: true,
                                department: true
                            },
                        })];
                case 2:
                    rooms = _b.sent();
                    totalPeriods_3 = 0;
                    filledPeriods_3 = 0;
                    rooms.forEach(function (room) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(room.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_3++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        if (((36 - score) / 36) > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if (((36 - score) / 36) > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, room.name);
                                    department.splice(i, 0, room.department ? room.department : "");
                                    rankScore.pop();
                                    rank.pop();
                                    department.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_3 += score;
                    });
                    percentage = (filledPeriods_3 / totalPeriods_3) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: department
                        }];
                case 3: return [4 /*yield*/, prisma.room.findMany({
                        where: {
                            orgId: user.orgId,
                            department: user.department,
                            lab: false
                        },
                        select: {
                            name: true,
                            timetable: true
                        },
                    })];
                case 4:
                    rooms = _b.sent();
                    totalPeriods_4 = 0;
                    filledPeriods_4 = 0;
                    rooms.forEach(function (room) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(room.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_4++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        if (((36 - score) / 36) > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if (((36 - score) / 36) > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, room.name);
                                    rankScore.pop();
                                    rank.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_4 += score;
                    });
                    percentage = (filledPeriods_4 / totalPeriods_4) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: null
                        }];
                case 5: return [3 /*break*/, 7];
                case 6: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        percentage: 0,
                        rank: rank,
                        score: rankScore,
                        department: null
                    }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getLabPercentage(token) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, user, rank, rankScore, department, labs, totalPeriods_5, filledPeriods_5, percentage, labs, totalPeriods_6, filledPeriods_6, percentage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.getPosition)(token)];
                case 1:
                    _a = _b.sent(), status = _a.status, user = _a.user;
                    rank = new Array(10).fill("");
                    rankScore = new Array(10).fill(0);
                    department = new Array(10).fill("");
                    if (!(status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId))) return [3 /*break*/, 6];
                    if (!(user.role == 'admin')) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.room.findMany({
                            where: {
                                orgId: user.orgId,
                                lab: true
                            },
                            select: {
                                name: true,
                                timetable: true,
                                department: true
                            },
                        })];
                case 2:
                    labs = _b.sent();
                    totalPeriods_5 = 0;
                    filledPeriods_5 = 0;
                    labs.forEach(function (lab) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(lab.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_5++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        if (((36 - score) / 36) > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if (((36 - score) / 36) > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, lab.name);
                                    department.splice(i, 0, lab.department ? lab.department : "");
                                    rankScore.pop();
                                    rank.pop();
                                    department.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_5 += score;
                    });
                    percentage = (filledPeriods_5 / totalPeriods_5) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: department
                        }];
                case 3: return [4 /*yield*/, prisma.room.findMany({
                        where: {
                            orgId: user.orgId,
                            department: user.department,
                            lab: true
                        },
                        select: {
                            name: true,
                            timetable: true
                        },
                    })];
                case 4:
                    labs = _b.sent();
                    totalPeriods_6 = 0;
                    filledPeriods_6 = 0;
                    labs.forEach(function (lab) {
                        var score = 0;
                        var timetable = (0, common_1.convertStringToTable)(lab.timetable);
                        timetable.forEach(function (day) {
                            day.forEach(function (period) {
                                totalPeriods_6++;
                                if (period != '0')
                                    score++;
                            });
                        });
                        if (((36 - score) / 36) > rankScore[9]) {
                            for (var i = 0; i < 10; i++) {
                                if (((36 - score) / 36) > rankScore[i]) {
                                    rankScore.splice(i, 0, (36 - score) / 36);
                                    rank.splice(i, 0, lab.name);
                                    rankScore.pop();
                                    rank.pop();
                                    break;
                                }
                            }
                        }
                        filledPeriods_6 += score;
                    });
                    percentage = (filledPeriods_6 / totalPeriods_6) * 100;
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            percentage: percentage,
                            rank: rank,
                            score: rankScore,
                            department: null
                        }];
                case 5: return [3 /*break*/, 7];
                case 6: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        percentage: 0,
                        rank: rank,
                        score: rankScore,
                        department: null
                    }];
                case 7: return [2 /*return*/];
            }
        });
    });
}

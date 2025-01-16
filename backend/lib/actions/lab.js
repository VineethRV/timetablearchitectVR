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
exports.createLab = createLab;
exports.deleteLabs = deleteLabs;
exports.getLabs = getLabs;
exports.updateLab = updateLab;
exports.peekLab = peekLab;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var prisma = new client_1.PrismaClient();
function createLab(JWTtoken, name, semester, batches, teachers, rooms, timetables, department) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_1, user, existingLab, lab, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_1 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                data: null,
                            }];
                    }
                    if (!(status_1 == statusCodes_1.statusCodes.OK && user && user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.lab.findFirst({
                            where: {
                                name: name,
                                semester: semester,
                                department: user.role == "admin" && department ? department : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    existingLab = _b.sent();
                    if (existingLab) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.BAD_REQUEST, data: null }];
                    }
                    return [4 /*yield*/, prisma.lab.create({
                            data: {
                                name: name,
                                semester: semester,
                                batches: batches.join(";"),
                                teachers: teachers.map(function (batch) { return batch.join(","); }).join(";"),
                                rooms: rooms.map(function (batch) { return batch.join(","); }).join(";"),
                                timetable: timetables.map(function (row) { return row.join(","); }).join(";"),
                                department: user.role == "admin" && department ? department : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 3:
                    lab = _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.CREATED, data: lab }];
                case 4: return [2 /*return*/, {
                        status: status_1 == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.FORBIDDEN : status_1,
                        data: null,
                    }];
                case 5:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
//TEACHER HANDELING HAS TO BE DONE
function deleteLabs(JWTtoken, labs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_2, user_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_2 = _a.status, user_1 = _a.user;
                    if ((user_1 === null || user_1 === void 0 ? void 0 : user_1.orgId) == null) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.BAD_REQUEST }];
                    }
                    if (!(status_2 == statusCodes_1.statusCodes.OK && user_1 && user_1.role != "viewer")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.lab.deleteMany({
                            where: {
                                OR: labs.map(function (lab) { return ({
                                    name: lab.name,
                                    semester: lab.semester,
                                    department: user_1.role == "admin" ? lab.department : user_1.department,
                                    orgId: user_1.orgId,
                                }); }),
                            },
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.OK }];
                case 3: return [2 /*return*/, {
                        status: status_2 == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.UNAUTHORIZED : status_2,
                    }];
                case 4:
                    error_2 = _b.sent();
                    console.error(error_2);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getLabs(JWTtoken_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, department, semester) {
        var _a, status_3, user, labs, labs, error_3;
        if (department === void 0) { department = null; }
        if (semester === void 0) { semester = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_3 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                data: null,
                            }];
                    }
                    if (!(status_3 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role == "admin")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.lab.findMany({
                            where: {
                                orgId: user.orgId,
                                semester: semester,
                            },
                        })];
                case 2:
                    labs = _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, data: labs }];
                case 3: return [4 /*yield*/, prisma.lab.findMany({
                        where: {
                            orgId: user.orgId,
                            department: user.department,
                            semester: semester,
                        },
                    })];
                case 4:
                    labs = _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, data: labs }];
                case 5: return [2 /*return*/, { status: status_3, data: null }];
                case 6:
                    error_3 = _b.sent();
                    console.error(error_3);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateLab(JWTtoken, originalName, originalSemester, lab, originalDepartment) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, existingLab, updatedLab, error_4;
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
                                data: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user && user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.lab.findFirst({
                            where: {
                                name: originalName,
                                semester: originalSemester,
                                department: user.role == "admin" && originalDepartment
                                    ? originalDepartment
                                    : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    existingLab = _b.sent();
                    if (!existingLab) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.NOT_FOUND, data: null }];
                    }
                    return [4 /*yield*/, prisma.lab.update({
                            where: { id: existingLab.id },
                            data: {
                                name: lab.name,
                                semester: lab.semester,
                                batches: lab.batches,
                                teachers: lab.teachers,
                                rooms: lab.rooms,
                                timetable: lab.timetable,
                                department: user.role == "admin" && lab.department
                                    ? lab.department
                                    : user.department,
                            },
                        })];
                case 3:
                    updatedLab = _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.OK, data: updatedLab }];
                case 4: return [2 /*return*/, {
                        status: status_4 == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.FORBIDDEN : status_4,
                        data: null,
                    }];
                case 5:
                    error_4 = _b.sent();
                    console.error(error_4);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function peekLab(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_5, user, lab, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                data: null,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.lab.findFirst({
                            where: {
                                name: name,
                                semester: semester,
                                department: user.role == "admin" && department ? department : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    lab = _b.sent();
                    return [2 /*return*/, {
                            status: lab ? statusCodes_1.statusCodes.OK : statusCodes_1.statusCodes.NOT_FOUND,
                            data: lab,
                        }];
                case 3: return [2 /*return*/, { status: status_5, data: null }];
                case 4:
                    error_5 = _b.sent();
                    console.error(error_5);
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null }];
                case 5: return [2 /*return*/];
            }
        });
    });
}

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createElective = createElective;
exports.updateElective = updateElective;
exports.peekElective = peekElective;
exports.getElectives = getElectives;
exports.deleteElective = deleteElective;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var prisma = new client_1.PrismaClient();
function createElective(JWTtoken_1, name_1, courses_1, teachers_1, rooms_1, semester_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, courses, teachers, rooms, semester, timetable, department) {
        var _a, status_1, user, elective, duplicate, _b;
        if (timetable === void 0) { timetable = null; }
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_1 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                elective: null,
                            }];
                    }
                    if (!(status_1 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role !== "viewer")) return [3 /*break*/, 4];
                    elective = {
                        name: name,
                        department: user.role === "admin" && department ? department : user.department,
                        courses: courses,
                        teachers: teachers,
                        rooms: rooms,
                        semester: semester,
                        orgId: user.orgId,
                        timetable: timetable
                            ? timetable
                            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    };
                    return [4 /*yield*/, prisma.elective.findFirst({
                            where: {
                                name: name,
                                department: elective.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    duplicate = _c.sent();
                    if (duplicate) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                elective: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.elective.create({
                            data: elective,
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            elective: elective,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        elective: null,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_1,
                        elective: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            elective: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateElective(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, originalName, originalDepartment, updatedElective) {
        var _a, status_2, user, elective, updated, _b;
        if (originalDepartment === void 0) { originalDepartment = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_2 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                elective: null,
                            }];
                    }
                    if (!(status_2 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role !== "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.elective.findFirst({
                            where: {
                                name: originalName,
                                department: user.role === "admin" && originalDepartment
                                    ? originalDepartment
                                    : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    elective = _c.sent();
                    if (!elective) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                                elective: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.elective.update({
                            where: {
                                id: elective.id,
                            },
                            data: {
                                name: updatedElective.name,
                                department: user.role === "admin" && updatedElective.department
                                    ? updatedElective.department
                                    : user.department,
                                courses: updatedElective.courses,
                                teachers: updatedElective.teachers,
                                rooms: updatedElective.rooms,
                                semester: updatedElective.semester,
                                timetable: updatedElective.timetable,
                            },
                        })];
                case 3:
                    updated = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            elective: updated,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        elective: null,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_2,
                        elective: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            elective: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function peekElective(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_3, user, elective, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_3 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                elective: null,
                            }];
                    }
                    if (!(status_3 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.elective.findFirst({
                            where: {
                                name: name,
                                semester: semester,
                                department: user.role === "admin" && department ? department : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    elective = _c.sent();
                    if (!elective) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                                elective: null,
                            }];
                    }
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            elective: elective,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_3,
                        elective: null,
                    }];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            elective: null,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getElectives(JWTtoken, semester, department) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, electives, modifiedElectives, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_4 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                electives: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.elective.findMany({
                            where: {
                                semester: semester,
                                department: user.role === "admin" && department ? department : user.department,
                                orgId: user.orgId,
                            },
                            select: {
                                name: true,
                                department: true,
                                orgId: true,
                            },
                        })];
                case 2:
                    electives = _c.sent();
                    modifiedElectives = electives.map(function (elective) { return (__assign(__assign({}, elective), { courses: null, teachers: null, rooms: null, semester: null, timetable: null })); });
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            electives: modifiedElectives,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_4,
                        electives: null,
                    }];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            electives: null,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteElective(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_5, user, elective, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                elective: null,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role !== "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.elective.findFirst({
                            where: {
                                name: name,
                                semester: semester,
                                department: user.role === "admin" && department
                                    ? department
                                    : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    elective = _c.sent();
                    if (!elective) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                                elective: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.elective.delete({
                            where: {
                                id: elective.id,
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            elective: elective,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        elective: null,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_5,
                        elective: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            elective: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}

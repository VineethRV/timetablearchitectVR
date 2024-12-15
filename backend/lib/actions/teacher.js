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
exports.createTeachers = createTeachers;
exports.updateTeachers = updateTeachers;
exports.createManyTeachers = createManyTeachers;
exports.getTeachers = getTeachers;
exports.peekTeacher = peekTeacher;
exports.deleteTeachers = deleteTeachers;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var prisma = new client_1.PrismaClient();
function convertTableToString(timetable) {
    return timetable.map(function (row) { return row.join(","); }).join(";");
}
function createTeachers(JWTtoken_1, name_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, initials, email, department, alternateDepartments, timetable, labtable) {
        var _a, status_1, user, teachers, teacher, _b;
        if (initials === void 0) { initials = null; }
        if (email === void 0) { email = null; }
        if (department === void 0) { department = null; }
        if (alternateDepartments === void 0) { alternateDepartments = null; }
        if (timetable === void 0) { timetable = null; }
        if (labtable === void 0) { labtable = null; }
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
                                teacher: null,
                            }];
                    }
                    if (!(status_1 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: name,
                                department: department ? department : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    teachers = _c.sent();
                    //if even a single teacher exists
                    if (teachers) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    teacher = {
                        name: name,
                        initials: initials,
                        email: email,
                        department: department
                            ? department
                            : user.department
                                ? user.department
                                : "no department",
                        alternateDepartments: alternateDepartments,
                        timetable: timetable
                            ? convertTableToString(timetable)
                            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                        labtable: labtable
                            ? convertTableToString(labtable)
                            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                        orgId: user.orgId,
                    };
                    return [4 /*yield*/, prisma.teacher.create({
                            data: teacher,
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            teacher: teacher,
                        }];
                case 4: 
                //if user is a viewer code will reach here
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        teacher: null,
                    }];
                case 5: 
                //if status not ok
                return [2 /*return*/, {
                        status: status_1,
                        teacher: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teacher: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateTeachers(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, originalName, originalDepartment, teacher) {
        var _a, status_2, user, teacherExists, updatedTeacher, _b;
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
                                teacher: null,
                            }];
                    }
                    if (!(status_2 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: originalName,
                                department: user.role == "admin" ? originalDepartment : user.department,
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    teacherExists = _c.sent();
                    if (!teacherExists) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.teacher.update({
                            where: {
                                id: teacherExists.id,
                            },
                            data: {
                                name: teacher.name,
                                initials: teacher.initials,
                                email: teacher.email,
                                department: user.role == "admin" && teacher.department
                                    ? teacher.department
                                    : user.department,
                                alternateDepartments: teacher.alternateDepartments,
                                timetable: teacher.timetable,
                                labtable: teacher.labtable,
                            },
                        })];
                case 3:
                    updatedTeacher = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            teacher: updatedTeacher,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        teacher: null,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_2,
                        teacher: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teacher: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function createManyTeachers(JWTtoken_1, name_1, initials_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, initials, email, department) {
        var _a, status_3, user, teachers, i, duplicateChecks_1, _b;
        if (email === void 0) { email = null; }
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_3 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teachers: null,
                            }];
                    }
                    if (!(status_3 == statusCodes_1.statusCodes.OK && user && user.role != "viewer")) return [3 /*break*/, 4];
                    teachers = [];
                    for (i = 0; i < name.length; i++) {
                        teachers.push({
                            name: name[i],
                            initials: initials ? initials[i] : null,
                            email: email ? email[i] : null,
                            department: department ? department : user.department,
                            alternateDepartments: null,
                            timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                            labtable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                            orgId: user.orgId,
                        });
                    }
                    return [4 /*yield*/, Promise.all(teachers.map(function (teacher) {
                            return prisma.teacher.findFirst({
                                where: {
                                    orgId: teacher.orgId,
                                    department: teacher.department,
                                    name: teacher.name,
                                },
                            });
                        }))];
                case 2:
                    duplicateChecks_1 = _c.sent();
                    //return duplicate teacher if found
                    if (duplicateChecks_1.some(function (duplicate) { return duplicate; })) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teachers: teachers.filter(function (teacher, index) { return duplicateChecks_1[index]; }),
                            }];
                    }
                    return [4 /*yield*/, prisma.teacher.createMany({
                            data: teachers,
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            teachers: teachers,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        teachers: null,
                    }];
                case 5:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teachers: null,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
//to display teachers list
function getTeachers(JWTtoken) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, teachers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_4 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teachers: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 6];
                    teachers = void 0;
                    if (!(user.role != "admin")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.teacher
                            .findMany({
                            where: {
                                orgId: user.orgId,
                                department: user.department,
                            },
                            select: {
                                name: true,
                                department: true,
                                initials: true,
                                email: true,
                                orgId: true,
                            },
                        })
                            //convert the returned object into Teacher[] type
                            .then(function (teachers) {
                            return teachers.map(function (teacher) { return (__assign(__assign({}, teacher), { alternateDepartments: null, timetable: null, labtable: null })); });
                        })];
                case 2:
                    teachers = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, prisma.teacher
                        .findMany({
                        where: {
                            orgId: user.orgId,
                        },
                        select: {
                            name: true,
                            department: true,
                            initials: true,
                            email: true,
                            orgId: true,
                        },
                    })
                        //convert the returned object into Teacher[] type
                        .then(function (teachers) {
                        return teachers.map(function (teacher) { return (__assign(__assign({}, teacher), { alternateDepartments: null, timetable: null, labtable: null })); });
                    })];
                case 4:
                    teachers = _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        teachers: teachers,
                    }];
                case 6: return [2 /*return*/, {
                        status: status_4,
                        teachers: null,
                    }];
                case 7: return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teachers: null,
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function peekTeacher(token_1, name_1) {
    return __awaiter(this, arguments, void 0, function (token, name, department) {
        var _a, status_5, user, teacher, _b;
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(token)];
                case 1:
                    _a = _c.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: name,
                                department: user.role == "admin"
                                    ? department
                                        ? department
                                        : user.department
                                    : user.department,
                                orgId: user.orgId,
                            },
                            select: {
                                name: true,
                                orgId: true,
                                department: true,
                                alternateDepartments: true,
                                initials: true,
                                email: true,
                                labtable: true,
                                timetable: true,
                            },
                        })];
                case 2:
                    teacher = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            teacher: teacher,
                        }];
                case 3: 
                //else
                return [2 /*return*/, {
                        status: status_5,
                        teacher: null,
                    }];
                case 4:
                    _b = _c.sent();
                    //internal error
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teacher: null,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteTeachers(JWTtoken, teachers) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, user, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 6, , 7]);
                    if (!(status == 200 && user)) return [3 /*break*/, 5];
                    if (!(user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.teacher.deleteMany({
                            where: {
                                OR: teachers.map(function (teacher) { return ({
                                    name: teacher.name,
                                    orgId: user.orgId,
                                    department: user.role == "admin" ? teacher.department : user.department,
                                }); }),
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 4: 
                //else
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                    }];
                case 5: 
                //else
                return [2 /*return*/, {
                        status: status,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}

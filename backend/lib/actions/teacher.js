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
exports.peekTeacherWithInitials = peekTeacherWithInitials;
exports.deleteTeachers = deleteTeachers;
exports.getConsolidated = getConsolidated;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var common_1 = require("../functions/common");
var prisma = new client_1.PrismaClient();
function convertTableToString(timetable) {
    return timetable.map(function (row) { return row.join(","); }).join(";");
}
function createTeachers(JWTtoken_1, name_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, initials, email, department, alternateDepartments, timetable, labtable) {
        var _a, status_1, user_1, teachers, teacher, teacherCreated, departments, _b;
        if (initials === void 0) { initials = null; }
        if (email === void 0) { email = null; }
        if (department === void 0) { department = null; }
        if (alternateDepartments === void 0) { alternateDepartments = null; }
        if (timetable === void 0) { timetable = null; }
        if (labtable === void 0) { labtable = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("inside createTeachers");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 2:
                    _a = _c.sent(), status_1 = _a.status, user_1 = _a.user;
                    if ((user_1 === null || user_1 === void 0 ? void 0 : user_1.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    if (!(status_1 == statusCodes_1.statusCodes.OK && user_1)) return [3 /*break*/, 10];
                    if (!(user_1.role != "viewer")) return [3 /*break*/, 9];
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: name,
                                department: department ? department : user_1.department,
                                orgId: user_1.orgId,
                            },
                        })];
                case 3:
                    teachers = _c.sent();
                    //if even a single teacher exists
                    if (teachers) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    //else
                    console.log("Alternate Departments: ", alternateDepartments);
                    teacher = {
                        name: name,
                        initials: initials,
                        email: email,
                        department: department
                            ? department
                            : user_1.department
                                ? user_1.department
                                : "no department",
                        alternateDepartments: alternateDepartments,
                        timetable: timetable
                            ? convertTableToString(timetable)
                            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                        labtable: labtable
                            ? convertTableToString(labtable)
                            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                        orgId: user_1.orgId,
                    };
                    return [4 /*yield*/, prisma.teacher.create({
                            data: {
                                name: name,
                                initials: initials,
                                email: email,
                                department: department
                                    ? department
                                    : user_1.department
                                        ? user_1.department
                                        : "no department",
                                timetable: timetable
                                    ? convertTableToString(timetable)
                                    : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                                labtable: labtable
                                    ? convertTableToString(labtable)
                                    : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                                orgId: user_1.orgId
                            },
                        })];
                case 4:
                    teacherCreated = _c.sent();
                    if (department) {
                        if (alternateDepartments) {
                            alternateDepartments.push(department);
                        }
                        else {
                            alternateDepartments = [department];
                        }
                    }
                    if (!alternateDepartments) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.departments.createMany({
                            data: alternateDepartments.map(function (dept) { return ({
                                name: dept,
                                orgId: user_1.orgId,
                            }); }),
                            skipDuplicates: true,
                        })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, prisma.departments.findMany({
                            where: {
                                name: {
                                    in: alternateDepartments
                                },
                                orgId: user_1.orgId
                            }
                        })];
                case 6:
                    departments = _c.sent();
                    return [4 /*yield*/, prisma.teacher.update({
                            where: {
                                id: teacherCreated.id
                            },
                            data: {
                                alternateDepartments: {
                                    set: [], // Clear existing connections
                                    connect: departments.map(function (dept) { return ({ id: dept.id }); })
                                }
                            }
                        })];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.CREATED,
                        teacher: teacher,
                    }];
                case 9: 
                //if user is a viewer code will reach here
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        teacher: null,
                    }];
                case 10: 
                //if status not ok
                return [2 /*return*/, {
                        status: status_1,
                        teacher: null,
                    }];
                case 11:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teacher: null,
                        }];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function updateTeachers(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, originalName, originalDepartment, teacher) {
        var _a, status_2, user_2, teacherExists, departments, _b;
        if (originalDepartment === void 0) { originalDepartment = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_2 = _a.status, user_2 = _a.user;
                    if ((user_2 === null || user_2 === void 0 ? void 0 : user_2.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    if (!(status_2 == statusCodes_1.statusCodes.OK && user_2)) return [3 /*break*/, 8];
                    if (!(user_2.role != "viewer")) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: originalName,
                                orgId: user_2.orgId,
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
                    departments = void 0;
                    if (!teacher.alternateDepartments) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.departments.createMany({
                            data: teacher.alternateDepartments.map(function (dept) { return ({
                                name: dept,
                                orgId: user_2.orgId,
                            }); }),
                            skipDuplicates: true,
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, prisma.departments.findMany({
                            where: {
                                name: {
                                    in: teacher.alternateDepartments
                                },
                                orgId: user_2.orgId
                            }
                        })];
                case 4:
                    departments = _c.sent();
                    _c.label = 5;
                case 5:
                    console.log("Alternate Departments: ", teacher.alternateDepartments);
                    return [4 /*yield*/, prisma.teacher.update({
                            where: {
                                id: teacherExists.id,
                            },
                            data: {
                                name: teacher.name,
                                initials: teacher.initials,
                                email: teacher.email,
                                department: user_2.role == "admin" && teacher.department
                                    ? teacher.department
                                    : user_2.department,
                                alternateDepartments: {
                                    connect: departments === null || departments === void 0 ? void 0 : departments.map(function (dept) { return ({ id: dept.id }); }) // Then add new ones
                                },
                                timetable: teacher.timetable,
                                labtable: teacher.labtable,
                            },
                        })];
                case 6:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            teacher: teacher,
                        }];
                case 7: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        teacher: null,
                    }];
                case 8: return [2 /*return*/, {
                        status: status_2,
                        teacher: null,
                    }];
                case 9:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teacher: null,
                        }];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function createManyTeachers(JWTtoken_1, name_1, initials_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, initials, email, department) {
        var _a, status_3, user, dep_1, teachers, i, teacher, createdTeachers, updates, error_1;
        if (email === void 0) { email = null; }
        if (department === void 0) { department = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    console.log("Starting createManyTeachers with", { name: name, initials: initials, email: email, department: department });
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_3 = _a.status, user = _a.user;
                    console.log("Auth status:", status_3, "User:", user);
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        console.log("User orgId is null");
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teachers: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.departments.createMany({
                            data: [{
                                    name: department ? department : user.department ? user.department : "no department",
                                    orgId: user.orgId,
                                }],
                            skipDuplicates: true,
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, prisma.departments.findMany({
                            where: {
                                name: department ? department : user.department ? user.department : "no department",
                                orgId: user.orgId
                            }
                        })];
                case 3:
                    dep_1 = _b.sent();
                    if (!(status_3 == statusCodes_1.statusCodes.OK && user && user.role != "viewer")) return [3 /*break*/, 7];
                    console.log("Creating teachers array");
                    teachers = [];
                    for (i = 0; i < name.length; i++) {
                        teacher = {
                            name: name[i],
                            initials: initials ? initials[i] : null,
                            email: email ? email[i] : null,
                            department: department ? department : user.department,
                            timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                            labtable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                            orgId: user.orgId,
                        };
                        console.log("Adding teacher:", teacher);
                        teachers.push(teacher);
                    }
                    console.log("Creating teachers in database");
                    return [4 /*yield*/, prisma.teacher.createMany({
                            data: teachers,
                            skipDuplicates: true
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, prisma.teacher.findMany({
                            where: {
                                name: { in: name },
                                orgId: user.orgId,
                            },
                            select: { id: true, name: true },
                        })];
                case 5:
                    createdTeachers = _b.sent();
                    updates = createdTeachers.map(function (teacher) { return ({
                        id: teacher.id,
                        alternateDepartments: dep_1.map(function (dept) { return ({ id: dept.id }); }),
                    }); });
                    console.log("Updating alternateDepartments for each teacher");
                    return [4 /*yield*/, Promise.all(updates.map(function (update) {
                            return prisma.teacher.update({
                                where: { id: update.id },
                                data: {
                                    alternateDepartments: {
                                        connect: update.alternateDepartments,
                                    },
                                },
                            });
                        }))];
                case 6:
                    _b.sent();
                    console.log("Successfully created teachers");
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            teachers: teachers,
                        }];
                case 7:
                    console.log("User not authorized");
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.FORBIDDEN,
                            teachers: null,
                        }];
                case 8:
                    error_1 = _b.sent();
                    console.error("Error in createManyTeachers:", error_1);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            teachers: null,
                        }];
                case 9: return [2 /*return*/];
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
                    if (!(user.role != "admin" && user.department)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.departments.findFirst({
                            where: {
                                name: user.department,
                                orgId: user.orgId
                            },
                            select: {
                                teachers: {
                                    select: {
                                        id: true,
                                        name: true,
                                        department: true,
                                        initials: true,
                                        email: true,
                                        orgId: true,
                                        timetable: true,
                                        labtable: true
                                    }
                                }
                            }
                        })];
                case 2:
                    teachers =
                        _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            teachers: (teachers === null || teachers === void 0 ? void 0 : teachers.teachers) ? teachers === null || teachers === void 0 ? void 0 : teachers.teachers : null
                        }];
                case 3: return [4 /*yield*/, prisma.teacher
                        .findMany({
                        where: {
                            orgId: user.orgId,
                        },
                        select: {
                            id: true,
                            name: true,
                            department: true,
                            initials: true,
                            email: true,
                            orgId: true,
                        },
                    })];
                case 4:
                    teachers = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            teachers: teachers
                        }];
                case 5: return [3 /*break*/, 7];
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
                    teacher = void 0;
                    return [4 /*yield*/, prisma.teacher.findFirst({
                            where: {
                                name: name,
                                orgId: user.orgId,
                            },
                            select: {
                                name: true,
                                orgId: true,
                                department: true,
                                alternateDepartments: {
                                    select: {
                                        name: true
                                    }
                                },
                                initials: true,
                                email: true,
                                labtable: true,
                                timetable: true,
                            },
                        })];
                case 2:
                    teacher = _c.sent();
                    if (teacher)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.OK,
                                teacher: __assign(__assign({}, teacher), { alternateDepartments: teacher.alternateDepartments.map(function (dep) { return dep.name; }) })
                            }];
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.NOT_FOUND,
                            teacher: null
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
function peekTeacherWithInitials(token_1, name_1) {
    return __awaiter(this, arguments, void 0, function (token, name, department) {
        var _a, status_6, user, teacher, _b;
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, auth.getPosition(token)];
                case 1:
                    _a = _c.sent(), status_6 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                teacher: null,
                            }];
                    }
                    if (!(status_6 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    teacher = void 0;
                    return [4 /*yield*/, prisma.teacher.findMany({
                            where: {
                                initials: { in: name },
                                orgId: user.orgId,
                            },
                            select: {
                                name: true,
                                orgId: true,
                                department: true,
                                alternateDepartments: {
                                    select: {
                                        name: true
                                    }
                                },
                                initials: true,
                                email: true,
                                labtable: true,
                                timetable: true,
                            },
                        })];
                case 2:
                    teacher = _c.sent();
                    if (teacher)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.OK,
                                teacher: __assign({}, teacher)
                            }];
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.NOT_FOUND,
                            teacher: null
                        }];
                case 3: 
                //else
                return [2 /*return*/, {
                        status: status_6,
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
function getConsolidated(JWTtoken) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_7, user, consolidatedTable_1, teachers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_7 = _a.status, user = _a.user;
                    if (status_7 == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                consolidatedTable: null,
                            }];
                    }
                    consolidatedTable_1 = Array(6).fill(null).map(function () {
                        return Array(6).fill(null).map(function () {
                            return Array(0).fill("");
                        });
                    });
                    teachers = void 0;
                    if (!(user && user.role == "admin")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.teacher.findMany({
                            where: {
                                orgId: user.orgId ? user.orgId : -1,
                            },
                            select: {
                                name: true,
                                timetable: true,
                                labtable: true,
                            },
                        })];
                case 2:
                    teachers = _c.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!user) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.teacher.findMany({
                            where: {
                                orgId: user.orgId ? user.orgId : -1,
                                department: user.department,
                            },
                            select: {
                                name: true,
                                timetable: true,
                                labtable: true,
                            },
                        })];
                case 4:
                    teachers = _c.sent();
                    _c.label = 5;
                case 5:
                    teachers === null || teachers === void 0 ? void 0 : teachers.forEach(function (teacher) {
                        var timetable = teacher.timetable;
                        var labtable = teacher.labtable;
                        var teacherTable = (0, common_1.convertStringToTable)(timetable);
                        var teacherLabTable = (0, common_1.convertStringToTable)(labtable);
                        for (var i = 0; i < 6; i++) {
                            for (var j = 0; j < 6; j++) {
                                if (teacherTable[i][j] == "0" && teacherLabTable[i][j] == "0") {
                                    consolidatedTable_1[i][j].push(teacher.name);
                                }
                            }
                        }
                    });
                    return [2 /*return*/, { consolidatedTable: consolidatedTable_1, status: statusCodes_1.statusCodes.OK }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            consolidatedTable: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}

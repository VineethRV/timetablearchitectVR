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
exports.createCourse = createCourse;
exports.deleteCourse = deleteCourse;
exports.updateCourse = updateCourse;
exports.getCourses = getCourses;
exports.peekCourse = peekCourse;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var prisma = new client_1.PrismaClient();
// For creating Courses by editors and admins
function createCourse(JWTtoken_1, name_1, code_1, credits_1, bFactor_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, code, credits, bFactor, semester, department) {
        var _a, status_1, user, Course, duplicates, newCourse, e_1;
        if (semester === void 0) { semester = null; }
        if (department === void 0) { department = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_1 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                Course: null,
                            }];
                    if (!(status_1 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 5];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 4];
                    Course = {
                        name: name,
                        code: code,
                        orgId: user.orgId,
                        credits: credits,
                        bFactor: bFactor,
                        department: user.department,
                        semester: semester,
                    };
                    if (user.role == "admin" && department) {
                        Course.department = department;
                    }
                    return [4 /*yield*/, prisma.course.findFirst({
                            where: {
                                orgId: Course.orgId,
                                department: Course.department,
                                name: name,
                            },
                        })];
                case 2:
                    duplicates = _b.sent();
                    if (duplicates) {
                        // Bad request
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                Course: null,
                            }];
                    }
                    return [4 /*yield*/, prisma.course.create({
                            data: Course,
                        })];
                case 3:
                    newCourse = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            Course: newCourse,
                        }];
                case 4: 
                // If role is viewer
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        Course: null,
                    }];
                case 5: 
                // If status is not OK
                return [2 /*return*/, {
                        status: status_1,
                        Course: null,
                    }];
                case 6:
                    e_1 = _b.sent();
                    console.error(e_1);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            Course: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function deleteCourse(JWTtoken_1, courseCode_1, semester_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, courseCode, semester, department) {
        var _a, status_2, user, course, e_2;
        if (department === void 0) { department = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), status_2 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                message: "organisation missing",
                            }];
                    if (!(status_2 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 5];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.course.findFirst({
                            where: {
                                code: courseCode,
                                semester: semester,
                                orgId: user.orgId,
                                department: user.role === "admin" && department
                                    ? department
                                    : user.department,
                            },
                        })];
                case 2:
                    course = _b.sent();
                    if (!course) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                                message: "Course not found",
                            }];
                    }
                    // Delete the course
                    return [4 /*yield*/, prisma.course.delete({
                            where: { id: course.id },
                        })];
                case 3:
                    // Delete the course
                    _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            message: "Course deleted successfully",
                        }];
                case 4: 
                // If role is viewer
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        message: "You do not have permission to delete courses",
                    }];
                case 5: 
                // If status is not OK
                return [2 /*return*/, {
                        status: status_2,
                        message: "Authentication failed",
                    }];
                case 6:
                    e_2 = _b.sent();
                    console.error(e_2);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            message: "Internal server error",
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateCourse(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, originalName, originalDepartment, originalSemester, course) {
        var _a, user, status_3, existingCourse, e_3;
        if (originalDepartment === void 0) { originalDepartment = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _b.sent(), user = _a.user, status_3 = _a.status;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    if (!(status_3 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 5];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.course.findFirst({
                            where: {
                                orgId: user.orgId,
                                department: user.role == "admin" && originalDepartment
                                    ? originalDepartment
                                    : user.department,
                                name: originalName,
                                semester: originalSemester,
                            },
                        })];
                case 2:
                    existingCourse = _b.sent();
                    if (!existingCourse) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                            }];
                    }
                    return [4 /*yield*/, prisma.course.update({
                            where: {
                                id: existingCourse.id,
                            },
                            data: {
                                name: course.name,
                                code: course.code,
                                semester: course.semester,
                                credits: course.credits,
                                bFactor: course.bFactor,
                                department: user.role == "admin" && course.department
                                    ? course.department
                                    : user.department,
                            },
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_3,
                    }];
                case 6:
                    e_3 = _b.sent();
                    console.error(e_3);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getCourses(JWTtoken, semester) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, courses, _b;
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
                                courses: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 6];
                    courses = void 0;
                    if (!(user.role != "admin")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.course.findMany({
                            where: {
                                orgId: user.orgId,
                                department: user.department,
                                semester: semester,
                            },
                        })];
                case 2:
                    courses = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, prisma.course.findMany({
                        where: {
                            orgId: user.orgId,
                            semester: semester,
                        },
                    })];
                case 4:
                    courses = _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        courses: courses,
                    }];
                case 6: return [2 /*return*/, {
                        status: status_4,
                        courses: null,
                    }];
                case 7: return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            courses: null,
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function peekCourse(JWTtoken_1, name_1, semester_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, semester, department) {
        var _a, status_5, user, course, _b;
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                course: null,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 6];
                    course = void 0;
                    if (!(user.role == 'admin')) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.course.findFirst({
                            where: {
                                name: name,
                                orgId: user.orgId,
                                semester: semester,
                            },
                        })];
                case 2:
                    course = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, prisma.course.findFirst({
                        where: {
                            name: name,
                            department: user.department,
                            orgId: user.orgId,
                            semester: semester,
                        },
                    })];
                case 4:
                    course = _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        course: course,
                    }];
                case 6: return [2 /*return*/, {
                        status: status_5,
                        course: null,
                    }];
                case 7:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            course: null,
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}

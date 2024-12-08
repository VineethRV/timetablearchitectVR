"use strict";
"use server";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = createCourse;
exports.deleteCourse = deleteCourse;
exports.updateCourse = updateCourse;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
//for creating Courses by editors, and admins
function createCourse(JWTtoken_1, name_1, code_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, name, code, semester = null, department = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            //if status is ok
            if (status == statusCodes_1.statusCodes.OK) {
                //check if role can make stuff
                if (user && user.role != "viewer") {
                    const Course = {
                        name: name,
                        code: code,
                        organisation: user.organisation,
                        department: user.department,
                        semester: semester,
                    };
                    if (user.role == "admin" && department) {
                        Course.department = department;
                    }
                    //first check if any duplicates there, org dep and name same
                    const duplicates = yield prisma.course.findFirst({
                        where: {
                            organisation: Course.organisation,
                            department: Course.department,
                            name: name,
                        },
                    });
                    if (duplicates) {
                        //bad request
                        return {
                            status: statusCodes_1.statusCodes.BAD_REQUEST,
                            Course: null,
                        };
                    }
                    //if check successfull
                    const newCourse = yield prisma.course.create({
                        data: Course,
                    });
                    return {
                        status: statusCodes_1.statusCodes.OK,
                        Course: newCourse,
                    };
                }
                //if role is viewer
                return {
                    status: statusCodes_1.statusCodes.FORBIDDEN,
                    Course: null,
                };
            }
            //if status is not ok
            return {
                status: status,
                Course: null,
            };
        }
        catch (e) {
            console.error(e);
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                Course: null,
            };
        }
    });
}
function deleteCourse(JWTtoken_1, courseCode_1, semester_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, courseCode, semester, department = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            // if status is ok
            if (status == statusCodes_1.statusCodes.OK) {
                // check if role can delete stuff
                if (user && user.role != "viewer") {
                    // check if the course exists
                    const course = yield prisma.course.findFirst({
                        where: {
                            code: courseCode,
                            semester: semester,
                            organisation: user.organisation,
                            department: user.role === "admin" && department ? department : user.department,
                        },
                    });
                    if (!course) {
                        return {
                            status: statusCodes_1.statusCodes.NOT_FOUND,
                            message: "Course not found",
                        };
                    }
                    // delete the course
                    yield prisma.course.delete({
                        where: { id: course.id },
                    });
                    return {
                        status: statusCodes_1.statusCodes.OK,
                        message: "Course deleted successfully",
                    };
                }
                // if role is viewer
                return {
                    status: statusCodes_1.statusCodes.FORBIDDEN,
                    message: "You do not have permission to delete courses",
                };
            }
            // if status is not ok
            return {
                status: status,
                message: "Authentication failed",
            };
        }
        catch (e) {
            console.error(e);
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
            };
        }
    });
}
function updateCourse(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, originalName, originalDepartment = null, originalSemester, course) {
        const { user, status } = yield auth.getPosition(JWTtoken);
        if (status == statusCodes_1.statusCodes.OK) {
            if (user && user.role != "viewer") {
                const existingCourse = yield prisma.course.findFirst({
                    where: {
                        organisation: user.organisation,
                        department: user.role == "admin" && originalDepartment ? originalDepartment : user.department,
                        name: originalName,
                        semester: originalSemester,
                    },
                });
                if (!existingCourse) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                    };
                }
                yield prisma.course.update({
                    where: {
                        id: existingCourse.id,
                    },
                    data: {
                        name: course.name,
                        code: course.code,
                        semester: course.semester,
                        department: user.role == "admin" && course.department ? course.department : user.department,
                    },
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
            };
        }
        return {
            status: status,
        };
    });
}

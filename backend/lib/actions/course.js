"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = createCourse;
exports.deleteCourse = deleteCourse;
exports.updateCourse = updateCourse;
exports.getCourses = getCourses;
exports.peekCourse = peekCourse;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
// For creating Courses by editors and admins
async function createCourse(JWTtoken, name, code, credits, bFactor, semester = null, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                Course: null,
            };
        // If status is OK
        if (status == statusCodes_1.statusCodes.OK) {
            // Check if role can make changes
            if (user && user.role != "viewer") {
                const Course = {
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
                // First check if any duplicates exist (orgId, department, and name same)
                const duplicates = await prisma.course.findFirst({
                    where: {
                        orgId: Course.orgId,
                        department: Course.department,
                        name: name,
                    },
                });
                if (duplicates) {
                    // Bad request
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        Course: null,
                    };
                }
                // If check is successful
                const newCourse = await prisma.course.create({
                    data: Course,
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                    Course: newCourse,
                };
            }
            // If role is viewer
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                Course: null,
            };
        }
        // If status is not OK
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
}
async function deleteCourse(JWTtoken, courseCode, semester, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                message: "organisation missing",
            };
        // If status is OK
        if (status == statusCodes_1.statusCodes.OK) {
            // Check if role can delete items
            if (user && user.role != "viewer") {
                // Check if the course exists
                const course = await prisma.course.findFirst({
                    where: {
                        code: courseCode,
                        semester: semester,
                        orgId: user.orgId,
                        department: user.role === "admin" && department
                            ? department
                            : user.department,
                    },
                });
                if (!course) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                        message: "Course not found",
                    };
                }
                // Delete the course
                await prisma.course.delete({
                    where: { id: course.id },
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                    message: "Course deleted successfully",
                };
            }
            // If role is viewer
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                message: "You do not have permission to delete courses",
            };
        }
        // If status is not OK
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
}
async function updateCourse(JWTtoken, originalName, originalDepartment = null, originalSemester, course) {
    try {
        const { user, status } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null)
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
            };
        if (status == statusCodes_1.statusCodes.OK) {
            if (user && user.role != "viewer") {
                const existingCourse = await prisma.course.findFirst({
                    where: {
                        orgId: user.orgId,
                        department: user.role == "admin" && originalDepartment
                            ? originalDepartment
                            : user.department,
                        name: originalName,
                        semester: originalSemester,
                    },
                });
                if (!existingCourse) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                    };
                }
                await prisma.course.update({
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
    }
    catch (e) {
        console.error(e);
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
        };
    }
}
async function getCourses(JWTtoken, semester) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                courses: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            let courses;
            if (user.role != "admin") {
                courses = await prisma.course.findMany({
                    where: {
                        orgId: user.orgId,
                        department: user.department,
                        semester: semester,
                    },
                });
            }
            else {
                courses = await prisma.course.findMany({
                    where: {
                        orgId: user.orgId,
                        semester: semester,
                    },
                });
            }
            return {
                status: statusCodes_1.statusCodes.OK,
                courses: courses,
            };
        }
        else {
            return {
                status: status,
                courses: null,
            };
        }
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            courses: null,
        };
    }
}
async function peekCourse(JWTtoken, name, semester, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                course: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            const course = await prisma.course.findFirst({
                where: {
                    name: name,
                    department: user.role == "admin" && department
                        ? department
                        : user.department,
                    orgId: user.orgId,
                    semester: semester,
                },
            });
            return {
                status: statusCodes_1.statusCodes.OK,
                course: course,
            };
        }
        return {
            status: status,
            course: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            course: null,
        };
    }
}

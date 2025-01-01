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
exports.createElective = createElective;
exports.updateElective = updateElective;
exports.peekElective = peekElective;
exports.getElectives = getElectives;
exports.deleteElective = deleteElective;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
async function createElective(JWTtoken, name, courses, teachers, rooms, semester, timetable = null, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                elective: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role !== "viewer") {
                const elective = {
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
                const duplicate = await prisma.elective.findFirst({
                    where: {
                        name,
                        department: elective.department,
                        orgId: user.orgId,
                    },
                });
                if (duplicate) {
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        elective: null,
                    };
                }
                await prisma.elective.create({
                    data: elective,
                });
                return {
                    status: statusCodes_1.statusCodes.CREATED,
                    elective,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                elective: null,
            };
        }
        return {
            status: status,
            elective: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            elective: null,
        };
    }
}
async function updateElective(JWTtoken, originalName, originalDepartment = null, updatedElective) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                elective: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role !== "viewer") {
                const elective = await prisma.elective.findFirst({
                    where: {
                        name: originalName,
                        department: user.role === "admin" && originalDepartment
                            ? originalDepartment
                            : user.department,
                        orgId: user.orgId,
                    },
                });
                if (!elective) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                        elective: null,
                    };
                }
                const updated = await prisma.elective.update({
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
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                    elective: updated,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                elective: null,
            };
        }
        return {
            status: status,
            elective: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            elective: null,
        };
    }
}
async function peekElective(JWTtoken, name, semester, department) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                elective: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            const elective = await prisma.elective.findFirst({
                where: {
                    name: name,
                    semester: semester,
                    department: user.role === "admin" && department ? department : user.department,
                    orgId: user.orgId,
                },
            });
            if (!elective) {
                return {
                    status: statusCodes_1.statusCodes.NOT_FOUND,
                    elective: null,
                };
            }
            return {
                status: statusCodes_1.statusCodes.OK,
                elective,
            };
        }
        return {
            status: status,
            elective: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            elective: null,
        };
    }
}
async function getElectives(JWTtoken, semester, department) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                electives: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            const electives = await prisma.elective.findMany({
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
            });
            const modifiedElectives = electives.map((elective) => ({
                ...elective,
                courses: null,
                teachers: null,
                rooms: null,
                semester: null,
                timetable: null,
            }));
            return {
                status: statusCodes_1.statusCodes.OK,
                electives: modifiedElectives,
            };
        }
        return {
            status: status,
            electives: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            electives: null,
        };
    }
}
async function deleteElective(JWTtoken, name, semester, department) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                elective: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role !== "viewer") {
                const elective = await prisma.elective.findFirst({
                    where: {
                        name: name,
                        semester: semester,
                        department: user.role === "admin" && department
                            ? department
                            : user.department,
                        orgId: user.orgId,
                    },
                });
                if (!elective) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                        elective: null,
                    };
                }
                await prisma.elective.delete({
                    where: {
                        id: elective.id,
                    },
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                    elective,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                elective: null,
            };
        }
        return {
            status: status,
            elective: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            elective: null,
        };
    }
}

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
exports.createElective = createElective;
exports.updateElective = updateElective;
exports.peekElective = peekElective;
exports.getElectives = getElectives;
exports.deleteElective = deleteElective;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
function createElective(JWTtoken_1, name_1, courses_1, teachers_1, rooms_1, semester_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, name, courses, teachers, rooms, semester, timetable = null, department = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
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
                    const duplicate = yield prisma.elective.findFirst({
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
                    yield prisma.elective.create({
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
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                elective: null,
            };
        }
    });
}
function updateElective(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, originalName, originalDepartment = null, updatedElective) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    elective: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                if (user.role !== "viewer") {
                    const elective = yield prisma.elective.findFirst({
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
                    const updated = yield prisma.elective.update({
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
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                elective: null,
            };
        }
    });
}
function peekElective(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    elective: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                const elective = yield prisma.elective.findFirst({
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
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                elective: null,
            };
        }
    });
}
function getElectives(JWTtoken, semester, department) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    electives: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                const electives = yield prisma.elective.findMany({
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
                const modifiedElectives = electives.map((elective) => (Object.assign(Object.assign({}, elective), { courses: null, teachers: null, rooms: null, semester: null, timetable: null })));
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
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                electives: null,
            };
        }
    });
}
function deleteElective(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    elective: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                if (user.role !== "viewer") {
                    const elective = yield prisma.elective.findFirst({
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
                    yield prisma.elective.delete({
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
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                elective: null,
            };
        }
    });
}

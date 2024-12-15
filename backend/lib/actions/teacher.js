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
exports.createTeachers = createTeachers;
exports.updateTeachers = updateTeachers;
exports.createManyTeachers = createManyTeachers;
exports.getTeachers = getTeachers;
exports.peekTeacher = peekTeacher;
exports.deleteTeachers = deleteTeachers;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
function convertTableToString(timetable) {
    return timetable.map((row) => row.join(",")).join(";");
}
function createTeachers(JWTtoken_1, name_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, name, initials = null, email = null, department = null, alternateDepartments = null, timetable = null, labtable = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    teacher: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                //if user isnt a viewer
                if (user.role != "viewer") {
                    //check if teacher with same name dep and org exist
                    const teachers = yield prisma.teacher.findFirst({
                        where: {
                            name: name,
                            department: department ? department : user.department,
                            orgId: user.orgId,
                        },
                    });
                    //if even a single teacher exists
                    if (teachers) {
                        return {
                            status: statusCodes_1.statusCodes.BAD_REQUEST,
                            teacher: null,
                        };
                    }
                    //else
                    const teacher = {
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
                    yield prisma.teacher.create({
                        data: teacher,
                    });
                    return {
                        status: statusCodes_1.statusCodes.CREATED,
                        teacher: teacher,
                    };
                }
                //if user is a viewer code will reach here
                return {
                    status: statusCodes_1.statusCodes.FORBIDDEN,
                    teacher: null,
                };
            }
            //if status not ok
            return {
                status: status,
                teacher: null,
            };
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                teacher: null,
            };
        }
    });
}
function updateTeachers(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, originalName, originalDepartment = null, teacher) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    teacher: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                if (user.role != "viewer") {
                    const teacherExists = yield prisma.teacher.findFirst({
                        where: {
                            name: originalName,
                            department: user.role == "admin" ? originalDepartment : user.department,
                            orgId: user.orgId,
                        },
                    });
                    if (!teacherExists) {
                        return {
                            status: statusCodes_1.statusCodes.BAD_REQUEST,
                            teacher: null,
                        };
                    }
                    const updatedTeacher = yield prisma.teacher.update({
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
                    });
                    return {
                        status: statusCodes_1.statusCodes.OK,
                        teacher: updatedTeacher,
                    };
                }
                return {
                    status: statusCodes_1.statusCodes.FORBIDDEN,
                    teacher: null,
                };
            }
            return {
                status: status,
                teacher: null,
            };
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                teacher: null,
            };
        }
    });
}
function createManyTeachers(JWTtoken_1, name_1, initials_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, name, initials, email = null, department = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    teachers: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user && user.role != "viewer") {
                const teachers = [];
                for (let i = 0; i < name.length; i++) {
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
                const duplicateChecks = yield Promise.all(teachers.map((teacher) => prisma.teacher.findFirst({
                    where: {
                        orgId: teacher.orgId,
                        department: teacher.department,
                        name: teacher.name,
                    },
                })));
                //return duplicate teacher if found
                if (duplicateChecks.some((duplicate) => duplicate)) {
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        teachers: teachers.filter((teacher, index) => duplicateChecks[index]),
                    };
                }
                yield prisma.teacher.createMany({
                    data: teachers,
                });
                return {
                    status: statusCodes_1.statusCodes.CREATED,
                    teachers: teachers,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                teachers: null,
            };
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                teachers: null,
            };
        }
    });
}
//to display teachers list
function getTeachers(JWTtoken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    teachers: null,
                };
            }
            //if verification of roles is ok
            if (status == statusCodes_1.statusCodes.OK && user) {
                let teachers;
                //if role isnt admin, return teachers from same department
                if (user.role != "admin") {
                    teachers = yield prisma.teacher
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
                        .then((teachers) => teachers.map((teacher) => (Object.assign(Object.assign({}, teacher), { alternateDepartments: null, timetable: null, labtable: null }))));
                }
                //if role is admin, return teachers from all departments
                else {
                    teachers = yield prisma.teacher
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
                        .then((teachers) => teachers.map((teacher) => (Object.assign(Object.assign({}, teacher), { alternateDepartments: null, timetable: null, labtable: null }))));
                }
                return {
                    status: statusCodes_1.statusCodes.OK,
                    teachers: teachers,
                };
            }
            else {
                return {
                    status: status,
                    teachers: null,
                };
            }
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                teachers: null,
            };
        }
    });
}
function peekTeacher(token_1, name_1) {
    return __awaiter(this, arguments, void 0, function* (token, name, department = null) {
        try {
            //get position of user
            const { status, user } = yield auth.getPosition(token);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    teacher: null,
                };
            }
            //if verification of rules is okay, perform the following
            if (status == statusCodes_1.statusCodes.OK && user) {
                const teacher = yield prisma.teacher.findFirst({
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
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                    teacher: teacher,
                };
            }
            //else
            return {
                status: status,
                teacher: null,
            };
        }
        catch (_a) {
            //internal error
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                teacher: null,
            };
        }
    });
}
function deleteTeachers(JWTtoken, teachers) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status, user } = yield auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
            };
        }
        try {
            if (status == 200 && user) {
                if (user.role != "viewer") {
                    yield prisma.teacher.deleteMany({
                        where: {
                            OR: teachers.map((teacher) => ({
                                name: teacher.name,
                                orgId: user.orgId,
                                department: user.role == "admin" ? teacher.department : user.department,
                            })),
                        },
                    });
                    return {
                        status: statusCodes_1.statusCodes.OK,
                    };
                }
                //else
                return {
                    status: statusCodes_1.statusCodes.FORBIDDEN,
                };
            }
            //else
            return {
                status: status,
            };
        }
        catch (_a) {
            return {
                status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    });
}

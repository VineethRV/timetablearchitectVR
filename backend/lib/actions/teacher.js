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
async function createTeachers(JWTtoken, name, initials = null, email = null, department = null, alternateDepartments = null, timetable = null, labtable = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
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
                const teachers = await prisma.teacher.findFirst({
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
                        : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    labtable: labtable
                        ? convertTableToString(labtable)
                        : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    orgId: user.orgId,
                };
                await prisma.teacher.create({
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            teacher: null,
        };
    }
}
async function updateTeachers(JWTtoken, originalName, originalDepartment = null, teacher) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                teacher: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role != "viewer") {
                const teacherExists = await prisma.teacher.findFirst({
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
                const updatedTeacher = await prisma.teacher.update({
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            teacher: null,
        };
    }
}
async function createManyTeachers(JWTtoken, name, initials, email = null, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
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
                    timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    labtable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    orgId: user.orgId,
                });
            }
            const duplicateChecks = await Promise.all(teachers.map((teacher) => prisma.teacher.findFirst({
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
            await prisma.teacher.createMany({
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            teachers: null,
        };
    }
}
//to display teachers list
async function getTeachers(JWTtoken) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
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
                teachers = await prisma.teacher
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
                    .then((teachers) => teachers.map((teacher) => ({
                    ...teacher,
                    alternateDepartments: null,
                    timetable: null, // Default value, since it's not queried
                    labtable: null, // Default value, since it's not queried
                })));
            }
            //if role is admin, return teachers from all departments
            else {
                teachers = await prisma.teacher
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
                    .then((teachers) => teachers.map((teacher) => ({
                    ...teacher,
                    alternateDepartments: null,
                    timetable: null, // Default value, since it's not queried
                    labtable: null, // Default value, since it's not queried
                })));
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            teachers: null,
        };
    }
}
async function peekTeacher(token, name, department = null) {
    try {
        //get position of user
        const { status, user } = await auth.getPosition(token);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                teacher: null,
            };
        }
        //if verification of rules is okay, perform the following
        if (status == statusCodes_1.statusCodes.OK && user) {
            const teacher = await prisma.teacher.findFirst({
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
            if (teacher)
                return {
                    status: statusCodes_1.statusCodes.OK,
                    teacher: teacher,
                };
            return {
                status: statusCodes_1.statusCodes.NOT_FOUND,
                teacher: null
            };
        }
        //else
        return {
            status: status,
            teacher: null,
        };
    }
    catch {
        //internal error
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            teacher: null,
        };
    }
}
async function deleteTeachers(JWTtoken, teachers) {
    const { status, user } = await auth.getPosition(JWTtoken);
    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
        return {
            status: statusCodes_1.statusCodes.BAD_REQUEST,
        };
    }
    try {
        if (status == 200 && user) {
            if (user.role != "viewer") {
                await prisma.teacher.deleteMany({
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
        };
    }
}

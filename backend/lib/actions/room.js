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
exports.createRoom = createRoom;
exports.createManyRoom = createManyRoom;
exports.updateRoom = updateRoom;
exports.getRooms = getRooms;
exports.peekRoom = peekRoom;
exports.deleteRooms = deleteRooms;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
function convertTableToString(timetable) {
    return timetable.map((row) => row.join(",")).join(";");
}
// function convertStringToTable(timetable:string):string[][]{
//     return timetable.split(";").map(row => row.split(","));
// }
//for creating rooms by editors, and admins
async function createRoom(JWTtoken, name, lab, timetable = null, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                room: null,
            };
        }
        //if status is ok
        if (status == statusCodes_1.statusCodes.OK) {
            //check if role can make stuff
            if (user && user.role != "viewer") {
                const room = {
                    name: name,
                    orgId: user.orgId,
                    department: user.department,
                    lab: lab,
                    timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                };
                if (timetable) {
                    room.timetable = convertTableToString(timetable);
                }
                if (user.role == "admin" && department) {
                    room.department = department;
                }
                //first check if any duplicates there, org dep and name same
                const duplicates = await prisma.room.findFirst({
                    where: {
                        orgId: room.orgId,
                        department: room.department,
                        name: name,
                    },
                });
                if (duplicates) {
                    //bad request
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        room: null,
                    };
                }
                //if check successfull
                await prisma.room.create({
                    data: room,
                });
                //created
                return {
                    status: statusCodes_1.statusCodes.CREATED,
                    room: room,
                };
            }
            //else return unauthorised
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                room: null,
            };
        }
        //not ok
        return {
            status: status,
            room: null,
        };
    }
    catch {
        //internal error
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            room: null,
        };
    }
}
async function createManyRoom(JWTtoken, name, lab, department = null) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                rooms: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK) {
            if (user && user.role != "viewer") {
                const rooms = [];
                for (let i = 0; i < name.length; i++) {
                    rooms.push({
                        name: name[i],
                        orgId: user.orgId,
                        department: department ? department : user.department,
                        lab: lab[i],
                        timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
                    });
                }
                const duplicateChecks = await Promise.all(rooms.map((room) => prisma.room.findFirst({
                    where: {
                        orgId: room.orgId,
                        department: room.department,
                        name: room.name,
                    },
                })));
                if (duplicateChecks.some((duplicate) => duplicate)) {
                    return {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        rooms: rooms.filter((room, index) => duplicateChecks[index]),
                    };
                }
                //if no duplicates, create rooms
                await prisma.room.createMany({
                    data: rooms,
                });
                return {
                    status: statusCodes_1.statusCodes.CREATED,
                    rooms: rooms,
                };
            }
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
                rooms: null,
            };
        }
        return {
            status: status,
            rooms: null,
        };
    }
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            rooms: null,
        };
    }
}
async function updateRoom(JWTtoken, originalName, originalDepartment = null, room) {
    try {
        const { status, user } = await auth.getPosition(JWTtoken);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role != "viewer") {
                const existingRoom = await prisma.room.findFirst({
                    where: {
                        orgId: user.orgId,
                        department: user.role == "admin" ? originalDepartment : user.department,
                        name: originalName,
                    },
                });
                if (!existingRoom) {
                    return {
                        status: statusCodes_1.statusCodes.NOT_FOUND,
                    };
                }
                await prisma.room.update({
                    where: {
                        id: existingRoom.id,
                    },
                    data: {
                        name: room.name,
                        department: user.role == "admin" && room.department
                            ? room.department
                            : user.department,
                        lab: room.lab,
                        timetable: room.timetable,
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
    catch {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
        };
    }
}
async function getRooms(token) {
    try {
        //get position of user
        const { status, user } = await auth.getPosition(token);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                rooms: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            //find all the clasrooms in his lab
            let rooms;
            if (user.role != "admin") {
                rooms = await prisma.room
                    .findMany({
                    where: {
                        orgId: user.orgId,
                        department: user.department,
                    },
                    select: {
                        name: true,
                        department: true,
                        lab: true,
                        orgId: true,
                    },
                })
                    .then((results) => results.map((room) => ({
                    ...room,
                    timetable: null, // Default value, since it's not queried
                })));
            }
            else {
                rooms = await prisma.room
                    .findMany({
                    where: {
                        orgId: user.orgId,
                    },
                    select: {
                        name: true,
                        department: true,
                        lab: true,
                        orgId: true,
                    },
                })
                    .then((results) => results.map((room) => ({
                    ...room,
                    timetable: null, // Default value, since it's not queried
                })));
            }
            return {
                status: statusCodes_1.statusCodes.OK,
                rooms: rooms,
            };
        }
        else {
            return {
                status: status,
                rooms: null,
            };
        }
    }
    catch {
        //internal error
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            rooms: null,
        };
    }
}
async function peekRoom(token, name, department = null) {
    try {
        //get position of user
        const { status, user } = await auth.getPosition(token);
        if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
            return {
                status: statusCodes_1.statusCodes.BAD_REQUEST,
                room: null,
            };
        }
        if (status == statusCodes_1.statusCodes.OK && user) {
            //find all the clasrooms in his lab
            const room = await prisma.room.findFirst({
                where: {
                    name: name,
                    department: user.role == "admin"
                        ? department
                            ? department
                            : user.department
                        : user.department, //if user is admin, refer the department passed in peekRoom(if a department isnt passed, the admins department is used), else use users deparment
                    orgId: user.orgId,
                },
            });
            return {
                status: statusCodes_1.statusCodes.OK,
                room: room,
            };
        }
        else {
            return {
                status: status,
                room: null,
            };
        }
    }
    catch {
        //internal error
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            room: null,
        };
    }
}
async function deleteRooms(JWTtoken, rooms) {
    const { status, user } = await auth.getPosition(JWTtoken);
    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
        return {
            status: statusCodes_1.statusCodes.BAD_REQUEST,
        };
    }
    try {
        if (status == statusCodes_1.statusCodes.OK && user) {
            if (user.role != "viewer") {
                await prisma.room.deleteMany({
                    where: {
                        OR: rooms.map((room) => ({
                            name: room.name,
                            orgId: user.orgId,
                            department: user.role == "admin" ? room.department : user.department,
                        })),
                    },
                });
                return {
                    status: statusCodes_1.statusCodes.OK,
                };
            }
            // else
            return {
                status: statusCodes_1.statusCodes.FORBIDDEN,
            };
        }
        // else
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

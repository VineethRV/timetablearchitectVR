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
exports.createRoom = createRoom;
exports.createManyRoom = createManyRoom;
exports.updateRoom = updateRoom;
exports.getRooms = getRooms;
exports.peekRoom = peekRoom;
exports.deleteRooms = deleteRooms;
var auth = require("./auth");
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var prisma = new client_1.PrismaClient();
function convertTableToString(timetable) {
    return timetable.map(function (row) { return row.join(","); }).join(";");
}
// function convertStringToTable(timetable:string):string[][]{
//     return timetable.split(";").map(row => row.split(","));
// }
//for creating rooms by editors, and admins
function createRoom(JWTtoken_1, name_1, lab_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, lab, timetable, department) {
        var _a, status_1, user, room, duplicates, _b;
        if (timetable === void 0) { timetable = null; }
        if (department === void 0) { department = null; }
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
                                room: null,
                            }];
                    }
                    if (!(status_1 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 5];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 4];
                    room = {
                        name: name,
                        orgId: user.orgId,
                        department: user.department,
                        lab: lab,
                        timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                    };
                    if (timetable) {
                        room.timetable = convertTableToString(timetable);
                    }
                    if (user.role == "admin" && department) {
                        room.department = department;
                    }
                    return [4 /*yield*/, prisma.room.findFirst({
                            where: {
                                orgId: room.orgId,
                                department: room.department,
                                name: name,
                            },
                        })];
                case 2:
                    duplicates = _c.sent();
                    if (duplicates) {
                        //bad request
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                room: null,
                            }];
                    }
                    //if check successfull
                    return [4 /*yield*/, prisma.room.create({
                            data: room,
                        })];
                case 3:
                    //if check successfull
                    _c.sent();
                    //created
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            room: room,
                        }];
                case 4: 
                //else return unauthorised
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        room: null,
                    }];
                case 5: 
                //not ok
                return [2 /*return*/, {
                        status: status_1,
                        room: null,
                    }];
                case 6:
                    _b = _c.sent();
                    //internal error
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            room: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function createManyRoom(JWTtoken_1, name_1, lab_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, name, lab, department) {
        var _a, status_2, user, rooms, i, duplicateChecks_1, _b;
        if (department === void 0) { department = null; }
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
                                rooms: null,
                            }];
                    }
                    if (!(status_2 == statusCodes_1.statusCodes.OK)) return [3 /*break*/, 5];
                    if (!(user && user.role != "viewer")) return [3 /*break*/, 4];
                    rooms = [];
                    for (i = 0; i < name.length; i++) {
                        rooms.push({
                            name: name[i],
                            orgId: user.orgId,
                            department: department ? department : user.department,
                            lab: lab[i],
                            timetable: "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;",
                        });
                    }
                    return [4 /*yield*/, Promise.all(rooms.map(function (room) {
                            return prisma.room.findFirst({
                                where: {
                                    orgId: room.orgId,
                                    department: room.department,
                                    name: room.name,
                                },
                            });
                        }))];
                case 2:
                    duplicateChecks_1 = _c.sent();
                    if (duplicateChecks_1.some(function (duplicate) { return duplicate; })) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                rooms: rooms.filter(function (room, index) { return duplicateChecks_1[index]; }),
                            }];
                    }
                    //if no duplicates, create rooms
                    return [4 /*yield*/, prisma.room.createMany({
                            data: rooms,
                        })];
                case 3:
                    //if no duplicates, create rooms
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED,
                            rooms: rooms,
                        }];
                case 4: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                        rooms: null,
                    }];
                case 5: return [2 /*return*/, {
                        status: status_2,
                        rooms: null,
                    }];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            rooms: null,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateRoom(JWTtoken_1, originalName_1) {
    return __awaiter(this, arguments, void 0, function (JWTtoken, originalName, originalDepartment, room) {
        var _a, status_3, user, existingRoom, _b;
        if (originalDepartment === void 0) { originalDepartment = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, auth.getPosition(JWTtoken)];
                case 1:
                    _a = _c.sent(), status_3 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                            }];
                    }
                    if (!(status_3 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.room.findFirst({
                            where: {
                                orgId: user.orgId,
                                department: user.role == "admin" ? originalDepartment : user.department,
                                name: originalName,
                            },
                        })];
                case 2:
                    existingRoom = _c.sent();
                    if (!existingRoom) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                            }];
                    }
                    return [4 /*yield*/, prisma.room.update({
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
                        })];
                case 3:
                    _c.sent();
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
                    _b = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getRooms(token) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status_4, user, rooms, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, auth.getPosition(token)];
                case 1:
                    _a = _c.sent(), status_4 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                rooms: null,
                            }];
                    }
                    if (!(status_4 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 6];
                    rooms = void 0;
                    if (!(user.role != "admin")) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.room
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
                            .then(function (results) {
                            return results.map(function (room) { return (__assign(__assign({}, room), { timetable: null })); });
                        })];
                case 2:
                    rooms = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, prisma.room
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
                        .then(function (results) {
                        return results.map(function (room) { return (__assign(__assign({}, room), { timetable: null })); });
                    })];
                case 4:
                    rooms = _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        rooms: rooms,
                    }];
                case 6: return [2 /*return*/, {
                        status: status_4,
                        rooms: null,
                    }];
                case 7: return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    //internal error
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            rooms: null,
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function peekRoom(token_1, name_1) {
    return __awaiter(this, arguments, void 0, function (token, name, department) {
        var _a, status_5, user, room, _b;
        if (department === void 0) { department = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, auth.getPosition(token)];
                case 1:
                    _a = _c.sent(), status_5 = _a.status, user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.BAD_REQUEST,
                                room: null,
                            }];
                    }
                    if (!(status_5 == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.room.findFirst({
                            where: {
                                name: name,
                                department: user.role == "admin"
                                    ? department
                                        ? department
                                        : user.department
                                    : user.department, //if user is admin, refer the department passed in peekRoom(if a department isnt passed, the admins department is used), else use users deparment
                                orgId: user.orgId,
                            },
                        })];
                case 2:
                    room = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                            room: room,
                        }];
                case 3: return [2 /*return*/, {
                        status: status_5,
                        room: null,
                    }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    _b = _c.sent();
                    //internal error
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                            room: null,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteRooms(JWTtoken, rooms) {
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
                    if (!(status == statusCodes_1.statusCodes.OK && user)) return [3 /*break*/, 5];
                    if (!(user.role != "viewer")) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.room.deleteMany({
                            where: {
                                OR: rooms.map(function (room) { return ({
                                    name: room.name,
                                    orgId: user.orgId,
                                    department: user.role == "admin" ? room.department : user.department,
                                }); }),
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 4: 
                // else
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.FORBIDDEN,
                    }];
                case 5: 
                // else
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

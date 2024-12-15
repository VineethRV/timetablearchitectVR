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
exports.createLab = createLab;
exports.deleteLabs = deleteLabs;
exports.getLabs = getLabs;
exports.updateLab = updateLab;
exports.peekLab = peekLab;
const auth = __importStar(require("./auth"));
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
function createLab(JWTtoken, name, semester, batches, teachers, rooms, timetables, department) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    data: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user && user.role != "viewer") {
                const existingLab = yield prisma.lab.findFirst({
                    where: {
                        name: name,
                        semester: semester,
                        department: user.role == "admin" && department ? department : user.department,
                        orgId: user.orgId,
                    },
                });
                if (existingLab) {
                    return { status: statusCodes_1.statusCodes.BAD_REQUEST, data: null };
                }
                const lab = yield prisma.lab.create({
                    data: {
                        name: name,
                        semester: semester,
                        batches: batches.join(";"),
                        teachers: teachers.map((batch) => batch.join(",")).join(";"),
                        rooms: rooms.map((batch) => batch.join(",")).join(";"),
                        timetable: timetables.map((row) => row.join(",")).join(";"),
                        department: user.role == "admin" && department ? department : user.department,
                        orgId: user.orgId,
                    },
                });
                return { status: statusCodes_1.statusCodes.CREATED, data: lab };
            }
            return {
                status: status == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.FORBIDDEN : status,
                data: null,
            };
        }
        catch (error) {
            console.error(error);
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null };
        }
    });
}
//TEACHER HANDELING HAS TO BE DONE
function deleteLabs(JWTtoken, labs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return { status: statusCodes_1.statusCodes.BAD_REQUEST };
            }
            if (status == statusCodes_1.statusCodes.OK && user && user.role != "viewer") {
                yield prisma.lab.deleteMany({
                    where: {
                        OR: labs.map((lab) => ({
                            name: lab.name,
                            semester: lab.semester,
                            department: user.role == "admin" ? lab.department : user.department,
                            orgId: user.orgId,
                        })),
                    },
                });
                return { status: statusCodes_1.statusCodes.OK };
            }
            return {
                status: status == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.UNAUTHORIZED : status,
            };
        }
        catch (error) {
            console.error(error);
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR };
        }
    });
}
function getLabs(JWTtoken_1) {
    return __awaiter(this, arguments, void 0, function* (JWTtoken, department = null, semester = null) {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    data: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                const labs = yield prisma.lab.findMany({
                    where: {
                        orgId: user.orgId,
                        department: user.role == "admin" && department ? department : user.department,
                        semester: semester,
                    },
                });
                return { status: statusCodes_1.statusCodes.OK, data: labs };
            }
            return { status: status, data: null };
        }
        catch (error) {
            console.error(error);
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null };
        }
    });
}
function updateLab(JWTtoken, originalName, originalSemester, lab, originalDepartment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    data: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user && user.role != "viewer") {
                const existingLab = yield prisma.lab.findFirst({
                    where: {
                        name: originalName,
                        semester: originalSemester,
                        department: user.role == "admin" && originalDepartment
                            ? originalDepartment
                            : user.department,
                        orgId: user.orgId,
                    },
                });
                if (!existingLab) {
                    return { status: statusCodes_1.statusCodes.NOT_FOUND, data: null };
                }
                const updatedLab = yield prisma.lab.update({
                    where: { id: existingLab.id },
                    data: {
                        name: lab.name,
                        semester: lab.semester,
                        batches: lab.batches,
                        teachers: lab.teachers,
                        rooms: lab.rooms,
                        timetable: lab.timetable,
                        department: user.role == "admin" && lab.department
                            ? lab.department
                            : user.department,
                    },
                });
                return { status: statusCodes_1.statusCodes.OK, data: updatedLab };
            }
            return {
                status: status == statusCodes_1.statusCodes.OK ? statusCodes_1.statusCodes.FORBIDDEN : status,
                data: null,
            };
        }
        catch (error) {
            console.error(error);
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null };
        }
    });
}
function peekLab(JWTtoken, name, semester, department) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { status, user } = yield auth.getPosition(JWTtoken);
            if ((user === null || user === void 0 ? void 0 : user.orgId) == null) {
                return {
                    status: statusCodes_1.statusCodes.BAD_REQUEST,
                    data: null,
                };
            }
            if (status == statusCodes_1.statusCodes.OK && user) {
                const lab = yield prisma.lab.findFirst({
                    where: {
                        name: name,
                        semester: semester,
                        department: user.role == "admin" && department ? department : user.department,
                        orgId: user.orgId,
                    },
                });
                return {
                    status: lab ? statusCodes_1.statusCodes.OK : statusCodes_1.statusCodes.NOT_FOUND,
                    data: lab,
                };
            }
            return { status: status, data: null };
        }
        catch (error) {
            console.error(error);
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, data: null };
        }
    });
}

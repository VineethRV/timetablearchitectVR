"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherPercentage = getTeacherPercentage;
exports.getRoomPercentage = getRoomPercentage;
exports.getLabPercentage = getLabPercentage;
const auth_1 = require("../actions/auth");
const statusCodes_1 = require("../types/statusCodes");
const client_1 = require("@prisma/client");
const common_1 = require("./common");
const prisma = new client_1.PrismaClient();
async function getTeacherPercentage(token) {
    let { status, user } = await (0, auth_1.getPosition)(token);
    let rank = new Array(10).fill("");
    let rankScore = new Array(10).fill(0);
    let department = new Array(10).fill("");
    console.log("token recieved\n");
    if (status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId)) {
        console.log("status ok\n");
        if (user.role == 'admin') {
            console.log("admin\n");
            let teachers = await prisma.teacher
                .findMany({
                where: {
                    orgId: user.orgId,
                },
                select: {
                    department: true,
                    name: true,
                    timetable: true,
                    labtable: true,
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            teachers.forEach((teacher) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                const labtable = (0, common_1.convertStringToTable)(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, teacher.name);
                            department.splice(i, 0, teacher.department ? teacher.department : "");
                            rankScore.pop();
                            department.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: department
            };
        }
        else {
            let teachers = await prisma.teacher
                .findMany({
                where: {
                    orgId: user.orgId,
                    department: user.department,
                },
                select: {
                    name: true,
                    timetable: true,
                    labtable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            teachers.forEach((teacher) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                const labtable = (0, common_1.convertStringToTable)(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, teacher.name);
                            rankScore.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: null
            };
        }
    }
    else {
        return {
            status: statusCodes_1.statusCodes.FORBIDDEN,
            percentage: 0,
            rank: rank,
            score: rankScore,
            department: null
        };
    }
}
async function getRoomPercentage(token) {
    let { status, user } = await (0, auth_1.getPosition)(token);
    let rank = new Array(10).fill("");
    let rankScore = new Array(10).fill(0);
    let department = new Array(10).fill("");
    if (status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId)) {
        if (user.role == 'admin') {
            let rooms = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    lab: false
                },
                select: {
                    name: true,
                    timetable: true,
                    department: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            rooms.forEach((room) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(room.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, room.name);
                            department.splice(i, 0, room.department ? room.department : "");
                            rankScore.pop();
                            rank.pop();
                            department.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: department
            };
        }
        else {
            let rooms = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    department: user.department,
                    lab: false
                },
                select: {
                    name: true,
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            rooms.forEach((room) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(room.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, room.name);
                            rankScore.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: null
            };
        }
    }
    else {
        return {
            status: statusCodes_1.statusCodes.FORBIDDEN,
            percentage: 0,
            rank: rank,
            score: rankScore,
            department: null
        };
    }
}
async function getLabPercentage(token) {
    let { status, user } = await (0, auth_1.getPosition)(token);
    let rank = new Array(10).fill("");
    let rankScore = new Array(10).fill(0);
    let department = new Array(10).fill("");
    if (status == statusCodes_1.statusCodes.OK && (user === null || user === void 0 ? void 0 : user.orgId)) {
        if (user.role == 'admin') {
            let labs = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    lab: true
                },
                select: {
                    name: true,
                    timetable: true,
                    department: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            labs.forEach((lab) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(lab.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, lab.name);
                            department.splice(i, 0, lab.department ? lab.department : "");
                            rankScore.pop();
                            rank.pop();
                            department.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: department
            };
        }
        else {
            let labs = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    department: user.department,
                    lab: true
                },
                select: {
                    name: true,
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;
            labs.forEach((lab) => {
                let score = 0;
                const timetable = (0, common_1.convertStringToTable)(lab.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0')
                            score++;
                    });
                });
                if ((36 - score) > rankScore[9]) {
                    for (let i = 0; i < 10; i++) {
                        if ((36 - score) > rankScore[i]) {
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, lab.name);
                            rankScore.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods += score;
            });
            const percentage = (filledPeriods / totalPeriods) * 100;
            return {
                status: statusCodes_1.statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore,
                department: null
            };
        }
    }
    else {
        return {
            status: statusCodes_1.statusCodes.FORBIDDEN,
            percentage: 0,
            rank: rank,
            score: rankScore,
            department: null
        };
    }
}

import { getPosition } from "../actions/auth";
import { statusCodes } from "../types/statusCodes";
import { PrismaClient } from "@prisma/client";
import { convertStringToTable } from "./common";
const prisma = new PrismaClient();

export async function getTeacherPercentage(token:string):Promise<{status:number,percentage:number}>{
    let {status,user}=await getPosition(token)
    console.log("token recieved\n")
    if(status==statusCodes.OK && user?.orgId){
        console.log("status ok\n")
        if(user.role=='admin'){
            console.log("admin\n")
            let teachers = await prisma.teacher
            .findMany({
                where: {
                orgId: user.orgId,
                },
                select: {
                    timetable:true,
                    labtable:true
                },
            })
            let totalPeriods = 0;
            let filledPeriods = 0;

            teachers.forEach((teacher) => {
                const timetable = convertStringToTable(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period!='0') filledPeriods++;
                    });
                });
                const labtable = convertStringToTable(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period!='0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        }
        else{
            let teachers = await prisma.teacher
            .findMany({
              where: {
                orgId: user.orgId,
                department: user.department,
              },
              select: {
                timetable:true
            },
          })
            let totalPeriods = 0;
            let filledPeriods = 0;

            teachers.forEach((teacher) => {
                const timetable = convertStringToTable(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period!='0') filledPeriods++;
                    });
                });
                const labtable = convertStringToTable(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period!='0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        }
    }
    else{
        return{
            status:statusCodes.FORBIDDEN,
            percentage:0
        }
    }
}
export async function getRoomPercentage(token: string): Promise<{ status: number, percentage: number }> {
    let { status, user } = await getPosition(token);
    if (status == statusCodes.OK && user?.orgId) {
        if (user.role == 'admin') {
            let rooms = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    lab:false
                },
                select: {
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;

            rooms.forEach((room) => {
                const timetable = convertStringToTable(room.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        } else {
            let rooms = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    department: user.department,
                    lab:false
                },
                select: {
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;

            rooms.forEach((room) => {
                const timetable = convertStringToTable(room.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        }
    } else {
        return {
            status: statusCodes.FORBIDDEN,
            percentage: 0
        };
    }
}
export async function getLabPercentage(token: string): Promise<{ status: number, percentage: number }> {
    let { status, user } = await getPosition(token);
    if (status == statusCodes.OK && user?.orgId) {
        if (user.role == 'admin') {
            let labs = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    lab: true
                },
                select: {
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;

            labs.forEach((lab) => {
                const timetable = convertStringToTable(lab.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        } else {
            let labs = await prisma.room.findMany({
                where: {
                    orgId: user.orgId,
                    department: user.department,
                    lab: true
                },
                select: {
                    timetable: true
                },
            });
            let totalPeriods = 0;
            let filledPeriods = 0;

            labs.forEach((lab) => {
                const timetable = convertStringToTable(lab.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period != '0') filledPeriods++;
                    });
                });
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
            };
        }
    } else {
        return {
            status: statusCodes.FORBIDDEN,
            percentage: 0
        };
    }
}
import { getPosition } from "../actions/auth";
import { statusCodes } from "../types/statusCodes";
import { PrismaClient } from "@prisma/client";
import { convertStringToTable } from "./common";
const prisma = new PrismaClient();

export async function getTeacherPercentage(token:string):Promise<{status:number,percentage:number, rank:string[],score:number[]}>{
    let {status,user}=await getPosition(token)
    let rank: string[] = [];
    let rankScore: number[] = new Array(10).fill(0);
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
                    name:true,
                    timetable:true,
                    labtable:true
                },
            })
            let totalPeriods = 0;
            let filledPeriods = 0;

            teachers.forEach((teacher) => {
                let score=0;
                const timetable = convertStringToTable(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period!='0') score++;
                    });
                });
                const labtable = convertStringToTable(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period!='0') score++;
                    });
                });
                if((36-score)>rankScore[9]){
                    for(let i=0;i<10;i++){
                        if((36-score)>rankScore[i]){
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, teacher.name);
                            rankScore.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods+=score;
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore
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
                name:true,
                timetable:true,
                labtable:true
            },
            })
            let totalPeriods = 0;
            let filledPeriods = 0;

            teachers.forEach((teacher) => {
                let score=0;
                const timetable = convertStringToTable(teacher.timetable);
                timetable.forEach((day) => {
                    day.forEach((period) => {
                        totalPeriods++;
                        if (period!='0') score++;
                    });
                });
                const labtable = convertStringToTable(teacher.timetable);
                labtable.forEach((day) => {
                    day.forEach((period) => {
                        if (period!='0') score++;
                    });
                });
                if((36-score)>rankScore[9]){
                    for(let i=0;i<10;i++){
                        if((36-score)>rankScore[i]){
                            rankScore.splice(i, 0, 36 - score);
                            rank.splice(i, 0, teacher.name);
                            rankScore.pop();
                            rank.pop();
                            break;
                        }
                    }
                }
                filledPeriods+=score;
            });

            const percentage = (filledPeriods / totalPeriods) * 100;

            return {
                status: statusCodes.OK,
                percentage: percentage,
                rank: rank,
                score: rankScore
            };
        }
    }
    else{
        return{
            status:statusCodes.FORBIDDEN,
            percentage:0,
            rank: rank,
            score: rankScore
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
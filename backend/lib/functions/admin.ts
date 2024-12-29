import { getPosition } from "../actions/auth";
import { Teacher,Room } from "../types/main";
import { statusCodes } from "../types/statusCodes";
import { PrismaClient } from "@prisma/client";
import { convertStringToTable } from "./common";
const prisma = new PrismaClient();

export async function getTeacherPercentage(token:string):Promise<{status:number,percentage:number}>{
    let {status,user}=await getPosition(token)
    if(status==statusCodes.OK && user?.orgId){
        if(user.role=='admin'){
            let teachers = await prisma.teacher
          .findMany({
            where: {
              orgId: user.orgId,
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
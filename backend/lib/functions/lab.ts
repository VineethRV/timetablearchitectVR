import { peekRoom } from "../actions/room";
import { peekTeacher } from "../actions/teacher";
import { statusCodes } from "../types/statusCodes";
import { convertTableToString, scoreRooms, scoreTeachers } from "./common";
export type getRecommendationsLab={
    courses:string[],
    teachers:string[][],
    rooms:string[][],
}

// function convertStringToTable(timetableString: string): string[][] {
//     return timetableString.split(";").map((row) => row.split(","));
// }

//create a lab object and pass to this function to generate the optimised 
//To call this function place an api call to /api/getLabRecommendation with the body, couse list, teachername list and room name list. also pass token in the header
//after that the function returns a status of 200 and a timetable string, with 0 in place of empty slots and names of subjects in place of filled slots. parse it using the convertStringToTable function(available in common.ts)
//if a collision occurs it returns alloted timetable till the collisiion occured and status code 503(Servie unavailable)
export async function getRecommendations(token:string,lab:getRecommendationsLab): Promise<{status:number, timetable: string|null}> {
    let timetable:string[][]|null=null
    //iterate through each course, and each teacher and room
    try{
        for(let i=0;i<lab.courses.length;i++){
            //get every teacher and room
            let teachers=[]
            let score:number[][]|null=null
            for(let j=0;j<lab.teachers[i].length;j++){
                let {status,teacher}=(await peekTeacher(token,lab.teachers[i][j]));
                if(status==statusCodes.OK && teacher){
                    teachers.push(teacher);
                    let scoreValue = scoreTeachers(teacher.timetable, teacher.labtable);
                    if(!score){
                        score=scoreValue
                        for(let i=0;i<scoreValue.length;i++){
                            for(let j=0;j<scoreValue[i].length;j++){
                                if(scoreValue[i][j]<0){
                                    score[i][j]=-1
                                }
                            }
                        }
                    }
                    else{ 
                        for(let i=0;i<scoreValue.length;i++){
                            for(let j=0;j<scoreValue[i].length;j++){
                                if(scoreValue[i][j]<0){
                                    score[i][j]=-1
                                }
                                else{
                                    if(score[i][j]!=-1)
                                        score[i][j]+=scoreValue[i][j]
                                }
                            }
                        }
                    }
                   
                }
                else
                    return {
                        status:status,
                        timetable:null
                    }
            }
            let rooms=[]
            for (let k = 0; k < lab.rooms[i].length; k++) {
                let {status, room} = await peekRoom(token,lab.rooms[i][k]);
                if (status == statusCodes.OK && room) {
                    rooms.push(room);
                let scoreValue = scoreRooms(room.timetable);
                if(!score){
                    return {
                        status: statusCodes.BAD_REQUEST,
                        timetable: null
                    }
                }
                for (let i = 0; i < scoreValue.length; i++) {
                    for (let j = 0; j < scoreValue[i].length; j++) {
                        if (scoreValue[i][j] < 0) {
                            score[i][j] = -1;
                        } 
                    }
                }
                } else {
                    return {
                        status: status,
                        timetable: null
                    };
                }
            }
            if(!score){
                return {
                    status: statusCodes.BAD_REQUEST,
                    timetable: null
                }
            }
            //we have got the top valid intersections.
            if (!timetable) {
                timetable = Array(score.length).fill(null).map(() => Array(score[0].length).fill("0"));
            }
            for (let i = 0; i < timetable.length; i++) {
                for (let j = 0; j < timetable[i].length; j++) {
                    if (timetable[i][j] !== "0") {
                        score[i][j] = -1;
                    }
                }
            }
            
            for(let i=0;i<score.length;i++){
                for(let j=0;j<score[i].length-1;j+=2){
                    if(score[i][j]==-1 || score[i][j+1]==-1){
                        score[i][j]=-1
                        score[i][j+1]=-1
                    }
                }
            }
            let maxSum = -1;
            let maxSumIndices = { i: -1, j: -1 };

            for (let i = 0; i < score.length; i++) {
                for (let j = 0; j < score[i].length - 1; j += 2) {
                    let sum = score[i][j] + score[i][j + 1];
                    if (sum > maxSum) {
                        maxSum = sum;
                        maxSumIndices = { i, j };
                    }
                }
            }
            if (maxSumIndices.i !== -1 && maxSumIndices.j !== -1) {
                timetable[maxSumIndices.i][maxSumIndices.j] = lab.courses[i];
                timetable[maxSumIndices.i][maxSumIndices.j + 1] = lab.courses[i];
            }
            else{
                return {
                    status: statusCodes.SERVICE_UNAVAILABLE,
                    timetable: convertTableToString(timetable)
                }
            }
        }
        return {
            status:statusCodes.OK,
            timetable:convertTableToString(timetable)
        }
    }
    catch{
        return {
            status:statusCodes.INTERNAL_SERVER_ERROR,
            timetable:null
        }
    }
}
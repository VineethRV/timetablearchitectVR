import { time } from "console";
import { peekRoom } from "../actions/room";
import { peekTeacher } from "../actions/teacher";
import { statusCodes } from "../types/statusCodes";
import { convertStringToTable, convertTableToString, scoreRooms, scoreTeachers } from "./common";
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
export async function getRecommendations(token:string,lab:getRecommendationsLab,blocks:string|null): Promise<{status:number, timetable: string|null}> {
    let timetable:string[][]|null=convertStringToTable(blocks);
    let labAllocated:boolean[]=[false,false,false,false,false,false]
    try{
        //iterate through each course
        for(let i=0;i<lab.courses.length;i++){
            let teachers=[]
            let score: number[][]=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
            //block places in score where timetable is already alloted
            if (timetable) {
                for(let j=0;j<timetable.length;j++){
                    if(labAllocated[j]){
                        for(let k=0;k<timetable[j].length;k++){
                            score[j][k] = -1;
                        }
                        continue;
                    }
                    for(let k=0;k<timetable[j].length;k++){
                        if (timetable[j][k] != "0") {
                            score[j][k] = -1;
                        } 
                    }
                }
            }
            console.log("timetable",timetable)
            //iterate through every teacher
            for(let j=0;j<lab.teachers[i].length;j++){
                let {status,teacher}=(await peekTeacher(token,lab.teachers[i][j]));
                if(status==statusCodes.OK && teacher){
                    teachers.push(teacher);
                    
                    //find intersection between teacher and scoreValue, and also score the valid slots
                    let scoreValue = scoreTeachers(teacher.timetable, teacher.labtable);
                    console.log("scoreT",scoreValue)
                    if(score.length==0){
                        score=scoreValue
                    }
                    else{ 
                        for(let i=0;i<scoreValue.length;i++){
                            for(let j=0;j<scoreValue[i].length;j++){
                                if(scoreValue[i][j]<0){
                                    score[i][j]=-1
                                }
                                else{
                                    if(score[i][j]>=0)
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
            //iterate through each room and find the valid intersections
            let rooms=[]
            for (let k = 0; k < lab.rooms[i].length; k++) {
                let {status, room} = await peekRoom(token,lab.rooms[i][k]);
                if (status == statusCodes.OK && room) {
                    rooms.push(room);
                    let scoreValue = scoreRooms(room.timetable);
                    console.log("RoomT",scoreValue)
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
                } 
                else {
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
            console.log(score)
            console.log(timetable)
            //we have got the top valid intersections.
            if (!timetable) {
                timetable = Array(score.length).fill(null).map(() => Array(score[0].length).fill("0"));
            }
            //group 2 periods together
            for(let i=0;i<score.length;i++){
                for(let j=0;j<score[i].length-1;j+=2){
                    if(score[i][j]<0 || score[i][j+1]<0){
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
                labAllocated[maxSumIndices.i]=true;
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


export async function recommendLab(
token:string,
Lteachers:string[],
Lrooms:string[],
blocks:string|null
):Promise<{status:number, timetable: string|null}>{
    let timetable:string[][]|null=convertStringToTable(blocks);
    try{
        let teachers=[]
        let score: number[][]=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
        if (timetable) {
            for(let j=0;j<timetable.length;j++){
                for(let k=0;k<timetable[j].length;k++){
                    if (timetable[j][k] != "0") {
                        score[j][k] = -1;
                    } 
                }
            }
        }
        for(let j=0;j<Lteachers.length;j++){
            let {status,teacher}=(await peekTeacher(token,Lteachers[j]));
            if(status==statusCodes.OK && teacher){
                teachers.push(teacher);
                let scoreValue = scoreTeachers(teacher.timetable, teacher.labtable);
                console.log("scoreT",scoreValue)
                if(score.length==0){
                    score=scoreValue
                }
                else{ 
                    for(let i=0;i<scoreValue.length;i++){
                        for(let j=0;j<scoreValue[i].length;j++){
                            if(scoreValue[i][j]<0){
                                score[i][j]=-1
                            }
                            else{
                                if(score[i][j]>=0)
                                    score[i][j]+=scoreValue[i][j]
                            }
                        }
                    }
                }
               
            }
            let rooms=[]
            for (let k = 0; k < Lrooms.length; k++) {
                let {status, room} = await peekRoom(token,Lrooms[k]);
                if (status == statusCodes.OK && room) {
                    rooms.push(room);
                    let scoreValue = scoreRooms(room.timetable);
                    console.log("RoomT",scoreValue)
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
                } 
                else {
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
                    if(score[i][j]<0 || score[i][j+1]<0){
                        score[i][j]=-1
                        score[i][j+1]=-1
                    }
                }
            }
            return {
                status: statusCodes.OK,
                timetable: convertTableToString(score.map((row) => row.map((val) => val.toString())))
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
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
                        timetable:"teacher error"
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
                        timetable: "Room error"
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
                let score: number[][] = Array(6).fill(0).map(() => Array(6).fill(0));
                for (let t = 0; t < teachers.length; t++) {
                    let teacherScore = scoreTeachers(teachers[t].timetable, teachers[t].labtable);
                    for (let i = 0; i < teacherScore.length; i++) {
                        for (let j = 0; j < teacherScore[i].length; j++) {
                            if (teacherScore[i][j] < 0) {
                                score[i][j] = -1;
                            }
                            else if(score[i][j]>=0){
                                score[i][j] += teacherScore[i][j];
                            }
                        }
                    }
                }
                for (let r = 0; r < rooms.length; r++) {
                    let roomScore = scoreRooms(rooms[r].timetable);
                    for (let i = 0; i < roomScore.length; i++) {
                        for (let j = 0; j < roomScore[i].length; j++) {
                            if (roomScore[i][j] < 0) {
                                score[i][j] = -1;
                            }
                        }
                    }
                }
                let alloted =false;
                for (let day = 0; day < score.length && !alloted; day++) {
                    for (let period = 0; period < score[day].length && !alloted; period+=2) {
                        if (score[day][period] >= 0 && blocks && blocks[day][period] == "0") {
                            //this means that a lab was allocated there, which has a possiblity of being shifted
                            let courseIndex = lab.courses.indexOf(timetable[day][period]);
                            if (courseIndex !== -1) {
                                let subScore: number[][] = Array(6).fill(0).map(() => Array(6).fill(0));
                                let subTeachers = lab.teachers[courseIndex];
                                let subRooms = lab.rooms[courseIndex];

                                for (let t = 0; t < subTeachers.length; t++) {
                                    let { status, teacher } = await peekTeacher(token, subTeachers[t]);
                                    if (status == statusCodes.OK && teacher) {
                                        let teacherScore = scoreTeachers(teacher.timetable, teacher.labtable);
                                        for (let i = 0; i < teacherScore.length; i++) {
                                            for (let j = 0; j < teacherScore[i].length; j++) {
                                                if (teacherScore[i][j] < 0) {
                                                    subScore[i][j] = -1;
                                                } else if (subScore[i][j] >= 0) {
                                                    subScore[i][j] += teacherScore[i][j];
                                                }
                                            }
                                        }
                                    }
                                }

                                for (let r = 0; r < subRooms.length; r++) {
                                    let { status, room } = await peekRoom(token, subRooms[r]);
                                    if (status == statusCodes.OK && room) {
                                        let roomScore = scoreRooms(room.timetable);
                                        for (let i = 0; i < roomScore.length; i++) {
                                            for (let j = 0; j < roomScore[i].length; j++) {
                                                if (roomScore[i][j] < 0) {
                                                    subScore[i][j] = -1;
                                                }
                                            }
                                        }
                                    }
                                }
                                for (let i = 0; i < subScore.length; i++) {
                                    if (labAllocated[i]) {
                                        for (let j = 0; j < subScore[i].length; j++) {
                                            subScore[i][j] = -1;
                                        }
                                    } else {
                                        for (let j = 0; j < subScore[i].length; j++) {
                                            if (subScore[i][j] >= 0 && timetable && timetable[i][j] !== "0") {
                                                subScore[i][j] = -1;
                                            }
                                        }
                                    }
                                }
                                let maxSubScore = -1;
                                let maxSubScoreIndices = { i: -1, j: -1 };

                                for (let i = 0; i < subScore.length; i++) {
                                    for (let j = 0; j < subScore[i].length - 1; j += 2) {
                                        let sum = subScore[i][j] + subScore[i][j + 1];
                                        if (sum > maxSubScore) {
                                            maxSubScore = sum;
                                            maxSubScoreIndices = { i, j };
                                        }
                                    }
                                }

                                if (maxSubScoreIndices.i !== -1 && maxSubScoreIndices.j !== -1) {
                                    timetable[maxSubScoreIndices.i][maxSubScoreIndices.j] = lab.courses[courseIndex];
                                    timetable[maxSubScoreIndices.i][maxSubScoreIndices.j + 1] = lab.courses[courseIndex];
                                    labAllocated[maxSubScoreIndices.i] = true;
                                    alloted=true;
                                    timetable[day][period+1]=lab.courses[i];
                                    timetable[day][period]=lab.courses[i];
                                }
                            }
                        }
                    }
                }
                if(!alloted)
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
):Promise<{status:number, timetable:string|null}>{
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
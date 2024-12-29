import { getPosition } from "../actions/auth";
import { Teacher,Room } from "../types/main";

export async function getTeacherPercentage(token:string){
    {status,user}=getPosition(token)
}
import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";
import { checkAuthentication, getPosition } from "./auth";

const prisma = new PrismaClient();
export async function Onboard( token:string,name: string,designation:string,dept: string,sections:number,teachers:number,students:number,depts_list: string[]): Promise<{ status: number }> {
     try {
      if(!token)
        {
          return {
            status: statusCodes.UNAUTHORIZED,
          };
        }
      const access=await checkAuthentication(token)
      if(!access)
      {
        return {
          status: statusCodes.UNAUTHORIZED,
        };
      }
      const user=await getPosition(token)
      if(!user.user)
      {
        return {
          status: statusCodes.UNAUTHORIZED,
        };
      }
      const duplicateOrg = await prisma.organisation.findFirst({
        where: {
          name,
        },
      });

      if (duplicateOrg) {
        return {
          status: statusCodes.CONFLICT,
        };
      }
       const organisation=await prisma.organisation.create({
        data: {
          name,
          designation,
          dept,
          sections,
          teachers,
          students,
          deptsList: depts_list.join(','),
          hasAccess:false,
        },
      });
      if(user.user)
      {
        user.user.department=dept,
        user.user.role="Admin",
        user.user.orgId=organisation.id
      }
      return {
        status: statusCodes.CREATED,
      };
    }
    catch {
      return {
        status: statusCodes.INTERNAL_SERVER_ERROR,
      }
    }
  }


  export async function ApproveAccess(
    token: string,
    tokenApprover: string,
    position: string
  ): Promise<{ status: number }> {
    try {
      const user = await getPosition(token); 
      const approver=await getPosition(tokenApprover)
      if(approver.user?.role!="Admin" && user.user?.orgId!=approver.user?.orgId)
        {
          return {
            status: statusCodes.NOT_FOUND, 
          };
        }
      if (!user) {
        return {
          status: statusCodes.NOT_FOUND, 
        };
      }
  
      await prisma.user.update({
        where: {
          id: user.user?.id 
        },
        data: {
          role: position, // Setting the role to the passed position
          hasAccess: true, // Setting hasAccess to true
        },
      });
  
      return {
        status: statusCodes.CREATED, // Successfully updated
      };
    } catch (error) {
      console.error("Error updating user access:", error); 
      return {
        status: statusCodes.INTERNAL_SERVER_ERROR, 
      };
    }
  }
 
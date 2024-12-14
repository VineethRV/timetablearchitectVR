import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";
import { checkAuthentication, getPosition } from "./auth";

const prisma = new PrismaClient();
export async function Onboard(
  token: string,
  name: string,
  designation: string,
  dept: string,
  sections: number,
  teachers: number,
  students: number,
  depts_list: string[]
): Promise<{ status: number }> {
  try {
    if (!token) {
      return {
        status: statusCodes.UNAUTHORIZED,
      };
    }

    const access = await checkAuthentication(token);
    if (!access) {
      return {
        status: statusCodes.UNAUTHORIZED,
      };
    }

    // Get user information
    const user = await getPosition(token);
    if (!user || !user.user) {
      console.log("No user found or user object is missing.");
      return { status: statusCodes.NOT_FOUND };
    }

    // Check for duplicate organization
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

    // Create the organization
    await prisma.organisation.create({
      data: {
        name,
        designation,
        dept,
        sections,
        teachers,
        students,
        deptsList: depts_list.join(','),
        hasAccess: false,
      },
    });

    // Update the user’s organization and role
    if (user.user) {
      user.user.organisation = name;
      user.user.role = "Admin";
      user.user.department = dept;

      // Ensure the user is updated in the database if necessary
      await prisma.user.update({
        where: { id: user.user.id },
        data: {
          organisation: name,
          role: "Admin",
          department: dept,
        },
      });
    }

    return {
      status: statusCodes.CREATED,
    };
  } catch (error) {
    console.error("Error during onboarding:", error);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}

  // export async function RequestAccess(
  //   token: string,
  //   role: string,
  //   organisation: string,
  //   department: string,
  // ): Promise<{ status: number }> {
  //   try {
  //     const user = await getPosition(token); 
  //     if(approver.user?.role!="Admin" && user.user?.organisation!=approver.user?.organisation)
  //       {
  //         return {
  //           status: statusCodes.NOT_FOUND, 
  //         };
  //       }
  //     if (!user) {
  //       return {
  //         status: statusCodes.NOT_FOUND, 
  //       };
  //     }
  
  //     await prisma.user.update({
  //       where: {
  //         id: user.user?.id 
  //       },
  //       data: {
  //         role: position, // Setting the role to the passed position
  //         hasAccess: true, // Setting hasAccess to true
  //       },
  //     });
  
  //     return {
  //       status: statusCodes.CREATED, // Successfully updated
  //     };
  //   } catch (error) {
  //     console.error("Error updating user access:", error); 
  //     return {
  //       status: statusCodes.INTERNAL_SERVER_ERROR, 
  //     };
  //   }
  // }
 



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
 
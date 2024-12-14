import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";
import { getPosition } from "./auth";

const prisma = new PrismaClient();

export async function onboarding(
  name: string,
  no_of_sections: number,
  no_of_teachers: number,
  no_of_students: number,
  depts_list: string[]
) {
  try {
    await prisma.organisation.create({
      data: {
        name,
        no_of_sections,
        no_of_teachers,
        no_of_students,
        depts_list: depts_list.join(","),
        approved: false,
      },    
    });

    return { status: statusCodes.CREATED };
  } catch {
    return { status: statusCodes.INTERNAL_SERVER_ERROR };
  }
}

// export async function ApproveAccess(
//   token: string,
//   tokenApprover: string,
//   position: string
// ): Promise<{ status: number }> {
//   try {
//     const user = await getPosition(token);
//     const approver = await getPosition(tokenApprover);
//     if (
//       approver.user?.role != "Admin" &&
//       user.user?.orgId != approver.user?.orgId
//     ) {
//       return {
//         status: statusCodes.NOT_FOUND,
//       };
//     }
//     if (!user) {
//       return {
//         status: statusCodes.NOT_FOUND,
//       };
//     }

//     await prisma.user.update({
//       where: {
//         id: user.user?.id,
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

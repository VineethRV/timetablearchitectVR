"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboarding = onboarding;
const client_1 = require("@prisma/client");
const statusCodes_1 = require("../types/statusCodes");
const prisma = new client_1.PrismaClient();
function onboarding(name, no_of_sections, no_of_teachers, no_of_students, depts_list) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.organisation.create({
                data: {
                    name,
                    no_of_sections,
                    no_of_teachers,
                    no_of_students,
                    depts_list: depts_list.join(","),
                    approved: false,
                },
            });
            return { status: statusCodes_1.statusCodes.CREATED };
        }
        catch (_a) {
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR };
        }
    });
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

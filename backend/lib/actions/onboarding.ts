import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";

const prisma = new PrismaClient();

export async function onboarding(
  name: string,
  no_of_sections: number,
  no_of_teachers: number,
  no_of_students: number,
  depts_list: string[],
  user_id: number
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
        ownerId: user_id,
      },
    });

    return { status: statusCodes.CREATED };
  } catch {
    return { status: statusCodes.INTERNAL_SERVER_ERROR };
  }
}

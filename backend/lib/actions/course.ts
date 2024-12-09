import * as auth from "./auth";
import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";
import { Course } from "../types/main";

const prisma = new PrismaClient();


//for creating Courses by editors, and admins
export async function createCourse(
  JWTtoken: string,
  name: string,
  code: string,
  semester: number | null = null,
  department: string | null = null
): Promise<{ status: number; Course: Course | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);
    //if status is ok
    if (status == statusCodes.OK) {
      //check if role can make stuff
      if (user && user.role != "viewer") {
        const Course: Course = {
          name: name,
          code: code,
          organisation: user.organisation,
          department: user.department,
          semester: semester,
        };
        if (user.role == "admin" && department) {
          Course.department = department;
        }
        //first check if any duplicates there, org dep and name same
        const duplicates = await prisma.course.findFirst({
          where: {
            organisation: Course.organisation,
            department: Course.department,
            name: name,
          },
        });
        if (duplicates) {
          //bad request
          return {
            status: statusCodes.BAD_REQUEST,
            Course: null,
          };
        }
        //if check successfull
        const newCourse = await prisma.course.create({
          data: Course,
        });
        return {
          status: statusCodes.OK,
          Course: newCourse,
        };
      }
      //if role is viewer
      return {
        status: statusCodes.FORBIDDEN,
        Course: null,
      };
    }
    //if status is not ok
    return {
      status: status,
      Course: null,
    };
  } catch (e) {
    console.error(e);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      Course: null,
    };
  }
}

export async function deleteCourse(JWTtoken: string, courseCode: string, semester: number, department: string|null=null): Promise<{ status: number; message: string }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);
    // if status is ok
    if (status == statusCodes.OK) {
      // check if role can delete stuff
      if (user && user.role != "viewer") {
        // check if the course exists
        const course = await prisma.course.findFirst({
          where: {
            code: courseCode,
            semester: semester,
            organisation: user.organisation,
            department: user.role === "admin" && department ? department : user.department,
          },
        });
        if (!course) {
          return {
            status: statusCodes.NOT_FOUND,
            message: "Course not found",
          };
        }
        // delete the course
        await prisma.course.delete({
          where: { id: course.id },
        });
        return {
          status: statusCodes.OK,
          message: "Course deleted successfully",
        };
      }
      // if role is viewer
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to delete courses",
      };
    }
    // if status is not ok
    return {
      status: status,
      message: "Authentication failed",
    };
  } catch (e) {
    console.error(e);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    };
  }
}
export async function updateCourse(
  JWTtoken: string,
  originalName: string,
  originalDepartment: string|null=null,
  originalSemester: number,
  course: Course
): Promise<{ status: number }> {
  const { user, status } = await auth.getPosition(JWTtoken);
  if (status == statusCodes.OK) {
    if (user && user.role != "viewer") {
      const existingCourse = await prisma.course.findFirst({
        where: {
          organisation: user.organisation,
          department: user.role == "admin" &&originalDepartment ? originalDepartment : user.department,
          name: originalName,
          semester: originalSemester,
        },
      });
      if (!existingCourse) {
        return {
          status: statusCodes.NOT_FOUND,
        };
      }
      await prisma.course.update({
        where: {
          id: existingCourse.id,
        },
        data: {
          name: course.name,
          code: course.code,
          semester: course.semester,
          department: user.role == "admin" && course.department? course.department : user.department,
        },
      });
      return {
        status: statusCodes.OK,
      };
    }
    return {
      status: statusCodes.FORBIDDEN,
    };
  }
  return {
    status: status,
  };
}
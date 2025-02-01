import * as auth from "./auth";
import { PrismaClient } from "@prisma/client";
import { statusCodes } from "../types/statusCodes";
import { Course } from "../types/main";
import { createDiffieHellman } from "crypto";

const prisma = new PrismaClient();

// For creating Courses by editors and admins
export async function createCourse(
  JWTtoken: string,
  name: string,
  code: string,
  credits: number|null,
  bFactor: number|null,
  semester: number | null = null,
  department: string | null = null
): Promise<{ status: number; Course: Course | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);
    if (user?.orgId == null)
      return {
        status: statusCodes.BAD_REQUEST,
        Course: null,
      };
    // If status is OK
    if (status == statusCodes.OK) {
      // Check if role can make changes
      if (user && user.role != "viewer") {
        const Course: Course = {
          name: name,
          code: code,
          orgId: user.orgId,
          credits: credits,
          bFactor:bFactor,
          department: user.department,
          semester: semester,
        };
        if (user.role == "admin" && department) {
          Course.department = department?department:user.department;
        }
        // First check if any duplicates exist (orgId, department, and name same)
        const duplicates = await prisma.course.findFirst({
          where: {
            orgId: Course.orgId,
            department: Course.department,
            name: name,
          },
        });
        if (duplicates) {
          // Bad request
          return {
            status: statusCodes.BAD_REQUEST,
            Course: null,
          };
        }
        // If check is successful
        const newCourse = await prisma.course.create({
          data: Course,
        });
        return {
          status: statusCodes.OK,
          Course: newCourse,
        };
      }
      // If role is viewer
      return {
        status: statusCodes.FORBIDDEN,
        Course: null,
      };
    }
    // If status is not OK
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

export async function deleteCourse(
  JWTtoken: string,
  courseCode: string,
  semester: number,
  department: string | null = null
): Promise<{ status: number; message: string }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);
    if (user?.orgId == null)
      return {
        status: statusCodes.BAD_REQUEST,
        message: "organisation missing",
      };
    // If status is OK
    if (status == statusCodes.OK) {
      // Check if role can delete items
      if (user && user.role != "viewer") {
        // Check if the course exists
        const course = await prisma.course.findFirst({
          where: {
            code: courseCode,
            semester: semester,
            orgId: user.orgId,
            department:
              user.role === "admin" && department
                ? department
                : user.department,
          },
        });
        if (!course) {
          return {
            status: statusCodes.NOT_FOUND,
            message: "Course not found",
          };
        }
        // Delete the course
        await prisma.course.delete({
          where: { id: course.id },
        });
        return {
          status: statusCodes.OK,
          message: "Course deleted successfully",
        };
      }
      // If role is viewer
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to delete courses",
      };
    }
    // If status is not OK
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
  originalDepartment: string | null = null,
  originalSemester: number,
  course: Course
): Promise<{ status: number }> {
  try {
    const { user, status } = await auth.getPosition(JWTtoken);
    if (user?.orgId == null)
      return {
        status: statusCodes.BAD_REQUEST,
      };
    if (status == statusCodes.OK) {
      if (user && user.role != "viewer") {
        const existingCourse = await prisma.course.findFirst({
          where: {
            orgId: user.orgId,
            department:
              user.role == "admin" && originalDepartment
                ? originalDepartment
                : user.department,
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
            credits:course.credits,
            bFactor:course.bFactor,
            department:
              user.role == "admin" && course.department
                ? course.department
                : user.department,
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
  } catch (e) {
    console.error(e);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}
export async function getCourses(
  JWTtoken: string,
  semester: number
): Promise<{ status: number; courses: Course[] | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        courses: null,
      };
    }

    if (status == statusCodes.OK && user) {
      let courses: Course[];

      if (user.role != "admin") {
        courses = await prisma.course.findMany({
          where: {
            orgId: user.orgId,
            department: user.department,
            semester: semester,
          },
        });
      } else {
        courses = await prisma.course.findMany({
          where: {
            orgId: user.orgId,
            semester: semester,
          },
        });
      }

      return {
        status: statusCodes.OK,
        courses: courses,
      };
    } else {
      return {
        status: status,
        courses: null,
      };
    }
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      courses: null,
    };
  }
}

export async function peekCourse(
  JWTtoken: string,
  name: string,
  semester: number,
  department: string | null = null,
): Promise<{ status: number; course: Course | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        course: null,
      };
    }

    if (status == statusCodes.OK && user) {
      let course
      if(user.role=='admin'){
        course = await prisma.course.findFirst({
          where: {
            name: name,
            orgId: user.orgId,
            semester: semester,
          },
        });
      }
      else{
        course = await prisma.course.findFirst({
          where: {
            name: name,
            department:user.department,
            orgId: user.orgId,
            semester: semester,
          },
        });

      }
      
      return {
        status: statusCodes.OK,
        course: course,
      };
    }
    return {
      status: status,
      course: null,
    };
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      course: null,
    };
  }
}

export async function peekCourseWithCode(
  JWTtoken: string,
  name: [string],
  semester: number,
  department: string | null = null,): Promise<{ status: number; course: any }>{
    
    try {
      console.log(JWTtoken)
      const { status, user } = await auth.getPosition(JWTtoken);
      console.log("status",status)
      if (user?.orgId == null) {
        return {
          status: statusCodes.BAD_REQUEST,
          course: null,
        };
      }
      if (status == statusCodes.OK && user) {
        let course
        if(user.role=='admin'){
          course = await prisma.course.findMany({
            where: {
              code: {in:name},
              orgId: user.orgId,
              semester: semester,
              department:department?department:user.department,
            },
          });
        }
        else{
          course = await prisma.course.findFirst({
            where: {
              code: {in:name},
              department:user.department,
              orgId: user.orgId,
              semester: semester,
            },
          });
        }
        return {
          status: statusCodes.OK,
          course: course,
        };
      }
      return {
        status: status,
        course: null,
      };
    } catch {
      return {
        status: statusCodes.INTERNAL_SERVER_ERROR,
        course: null,
      };
    }
}

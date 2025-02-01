import * as auth from "./auth";
import { PrismaClient } from "@prisma/client";
import { Teacher } from "../types/main";
import { statusCodes } from "../types/statusCodes";
import { connect } from "http2";
import { convertStringToTable } from "../functions/common";
import { STATUS_CODES } from "http";

const prisma = new PrismaClient();

function convertTableToString(timetable: string[][]): string {
  return timetable.map((row) => row.join(",")).join(";");
}

export async function createTeachers(
  JWTtoken: string,
  name: string,
  initials: string | null = null,
  email: string | null = null,
  department: string | null = null,
  alternateDepartments: string[] | null = null,
  timetable: string[][] | null = null,
  labtable: string[][] | null = null
): Promise<{ status: number; teacher: Teacher | null }> {
  console.log("inside createTeachers");
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        teacher: null,
      };
    }

    if (status == statusCodes.OK && user) {
      //if user isnt a viewer
      if (user.role != "viewer") {
        //check if teacher with same name dep and org exist
        const teachers = await prisma.teacher.findFirst({
          where: {
            name: name,
            department: department ? department : user.department,
            orgId: user.orgId,
          },
        });
        //if even a single teacher exists
        if (teachers) {
          return {
            status: statusCodes.BAD_REQUEST,
            teacher: null,
          };
        }
        //else
        console.log("Alternate Departments: ", alternateDepartments);
        const teacher: Teacher = {
          name: name,
          initials: initials,
          email: email,
          department: department
            ? department
            : user.department
            ? user.department
            : "no department",
          alternateDepartments: alternateDepartments,
          timetable: timetable
            ? convertTableToString(timetable)
            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
          labtable: labtable
            ? convertTableToString(labtable)
            : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
          orgId: user.orgId,
        };
        let teacherCreated=await prisma.teacher.create({
          data: {
            name: name,
            initials: initials,
            email: email,
            department: department
              ? department
              : user.department
              ? user.department
              : "no department",
            timetable: timetable
              ? convertTableToString(timetable)
              : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
            labtable: labtable
              ? convertTableToString(labtable)
              : "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
            orgId: user.orgId
          },
        });
        if(department){
          if(alternateDepartments){
            alternateDepartments.push(department);
          }
          else{
            alternateDepartments=[department];
          }
        }
        if (alternateDepartments) {
          await prisma.departments.createMany({
            data: alternateDepartments.map(dept => ({
              name: dept,
              orgId: user.orgId,
            })),
            skipDuplicates: true,
          });
          const departments = await prisma.departments.findMany({
            where: {
              name: {
                in: alternateDepartments
              },
              orgId: user.orgId
            }
          });
            await prisma.teacher.update({
            where: {
              id: teacherCreated.id
            },
            data: {
              alternateDepartments: {
              set: [], // Clear existing connections
              connect: departments.map(dept => ({ id: dept.id }))
              }
            }
            });
        }
        return {
          status: statusCodes.CREATED,
          teacher: teacher,
        };
      }
      //if user is a viewer code will reach here
      return {
        status: statusCodes.FORBIDDEN,
        teacher: null,
      };
    }
    //if status not ok
    return {
      status: status,
      teacher: null,
    };
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teacher: null,
    };
  }
}

export async function updateTeachers(
  JWTtoken: string,
  originalName: string,
  originalDepartment: string | null = null,
  teacher: Teacher
): Promise<{ status: number; teacher: Teacher | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        teacher: null,
      };
    }

    if (status == statusCodes.OK && user) {
      if (user.role != "viewer") {
        const teacherExists = await prisma.teacher.findFirst({
          where: {
            name: originalName,
            orgId: user.orgId,
          },
        });
        if (!teacherExists) {
          return {
            status: statusCodes.BAD_REQUEST,
            teacher: null,
          };
        }
        let departments;
        if (teacher.alternateDepartments) {
          await prisma.departments.createMany({
            data: teacher.alternateDepartments.map(dept => ({
              name: dept,
              orgId: user.orgId,
            })),
            skipDuplicates: true,
          });
          departments = await prisma.departments.findMany({
            where: {
              name: {
                in: teacher.alternateDepartments
              },
              orgId: user.orgId
            }
          });
        }
        console.log("Alternate Departments: ", teacher.alternateDepartments);
        await prisma.teacher.update({
          where: {
            id: teacherExists.id,
          },
          data: {
            name: teacher.name,
            initials: teacher.initials,
            email: teacher.email,
            department:
              user.role == "admin" && teacher.department
          ? teacher.department
          : user.department,
            alternateDepartments: {
              connect: departments?.map(dept => ({ id: dept.id })) // Then add new ones
            },
            timetable: teacher.timetable,
            labtable: teacher.labtable,
          },
        });
        return {
          status: statusCodes.OK,
          teacher: teacher,
        };
      }
      return {
        status: statusCodes.FORBIDDEN,
        teacher: null,
      };
    }
    return {
      status: status,
      teacher: null,
    };
  } 
  catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teacher: null,
    };
  }
}

export async function createManyTeachers(
  JWTtoken: string,
  name: string[],
  initials: string[] | null,
  email: string[] | null = null,
  department: string | null = null
): Promise<{ status: number; teachers: any[] | null }> {

  try {
    console.log("Starting createManyTeachers with", { name, initials, email, department });
    const { status, user } = await auth.getPosition(JWTtoken);
    console.log("Auth status:", status, "User:", user);

    if (user?.orgId == null) {
      console.log("User orgId is null");
      return {
        status: statusCodes.BAD_REQUEST,
        teachers: null,
      };
    }
    await prisma.departments.createMany({
      data: [{
        name: department ? department : user.department?user.department:"no department",
        orgId: user.orgId,
      }],
      skipDuplicates: true,
    })
    const dep = await prisma.departments.findMany({
      where: {
        name: department ? department : user.department?user.department:"no department",
        orgId: user.orgId
      }
    });

    if (status == statusCodes.OK && user && user.role != "viewer") {
      console.log("Creating teachers array");
      const teachers = [];

      for (let i = 0; i < name.length; i++) {
        const teacher = {
          name: name[i],
          initials: initials ? initials[i] : null,
          email: email ? email[i] : null,
          department: department ? department : user.department,
          timetable:
            "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
          labtable:
            "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
          orgId: user.orgId,
        };
        console.log("Adding teacher:", teacher);
        teachers.push(teacher);
      }
      console.log("Creating teachers in database");
      await prisma.teacher.createMany({
        data: teachers,
        skipDuplicates:true
      });
      const createdTeachers = await prisma.teacher.findMany({
        where: {
          name: { in: name },
          orgId: user.orgId,
        },
        select: { id: true, name: true },
      });
      // Map teacher IDs to their corresponding alternate departments
      const updates = createdTeachers.map(teacher => ({
        id: teacher.id,
        alternateDepartments: dep.map(dept => ({ id: dept.id })),
      }));
      console.log("Updating alternateDepartments for each teacher");
      await Promise.all(
        updates.map(update =>
          prisma.teacher.update({
            where: { id: update.id },
            data: {
              alternateDepartments: {
                connect: update.alternateDepartments,
              },
            },
          })
        )
      );
      console.log("Successfully created teachers");
      return {
        status: statusCodes.CREATED,
        teachers: teachers,
      };
    }
    console.log("User not authorized");
    return {
      status: statusCodes.FORBIDDEN,
      teachers: null,
    };
  }
  catch (error) {
    console.error("Error in createManyTeachers:", error);
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teachers: null,
    };
  }
}
export type retTeacher = {
  id: number;
  name: string;
  initials: string | null;
  email: string | null;
  department: string | null;
  orgId: number;
};
//to display teachers list
export async function getTeachers(
  JWTtoken: string
): Promise<{ status: number; teachers: retTeacher[] | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        teachers: null,
      };
    }

    //if verification of roles is ok
    if (status == statusCodes.OK && user) {
      let teachers;

      //if role isnt admin, return teachers from same department
      if (user.role != "admin" && user.department) {
        teachers = 
          await prisma.departments.findFirst({
            where: {
              name: user.department,
              orgId: user.orgId
            },
            select: {
              teachers: {
                select: {
                  id: true,
                  name: true,
                  department: true,
                  initials: true,
                  email: true,
                  orgId: true,
                  timetable: true,
                  labtable: true
                }
              }
            }
          })
        return {
          status: statusCodes.OK,
          teachers: teachers?.teachers?teachers?.teachers:null
        };
      }
      //if role is admin, return teachers from all departments
      else {
        teachers = await prisma.teacher
          .findMany({
            where: {
              orgId: user.orgId,
            },
            select: {
              id: true,
              name: true,
              department: true,
              initials: true,
              email: true,
              orgId: true,
            },
          })
        return {
          status: statusCodes.OK,
          teachers: teachers
        };
      }
    } else {
      return {
        status: status,
        teachers: null,
      };
    }
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teachers: null,
    };
  }
}

export async function peekTeacher(
  token: string,
  name: string,
  department: string | null = null
): Promise<{ status: number; teacher: Teacher | null }> {
  try {
    //get position of user
    const { status, user } = await auth.getPosition(token);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        teacher: null,
      };
    }

    //if verification of rules is okay, perform the following
    if (status == statusCodes.OK && user) {
      let teacher 
      teacher=await prisma.teacher.findFirst({
        where: {
          name: name,
          orgId: user.orgId,
        },
        select: {
          name: true,
          orgId: true,
          department: true,
          alternateDepartments: {
            select: {
              name: true
            }
          },
          initials: true,
          email: true,
          labtable: true,
          timetable: true,
        },
      });
      if(teacher)
        return {
          status: statusCodes.OK,
          teacher: 
                  {
                    ...teacher,
                    alternateDepartments: teacher.alternateDepartments.map(dep => dep.name)
                  }
        };
      return{
        status:statusCodes.NOT_FOUND,
        teacher:null
      }
    }
    //else
    return {
      status: status,
      teacher: null,
    };
  } catch {
    //internal error
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teacher: null,
    };
  }
}

export async function peekTeacherWithInitials(
  token: string,
  name: [string],
  department: string | null = null
): Promise<{ status: number; teacher: any }> {
  try {
    //get position of user
    const { status, user } = await auth.getPosition(token);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        teacher: null,
      };
    }

    //if verification of rules is okay, perform the following
    if (status == statusCodes.OK && user) {
      let teacher 
      teacher=await prisma.teacher.findMany({
        where: {
          initials: {in:name},
          orgId: user.orgId,
        },
        select: {
          name: true,
          orgId: true,
          department: true,
          alternateDepartments: {
            select: {
              name: true
            }
          },
          initials: true,
          email: true,
          labtable: true,
          timetable: true,
        },
      });
      if(teacher)
        return {
          status: statusCodes.OK,
          teacher: 
                  {
                    ...teacher
                  }
        };
      return{
        status:statusCodes.NOT_FOUND,
        teacher:null
      }
    }
    //else
    return {
      status: status,
      teacher: null,
    };
  } catch {
    //internal error
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      teacher: null,
    };
  }
}

export async function deleteTeachers(
  JWTtoken: string,
  teachers: Teacher[]
): Promise<{ status: number }> {
  const { status, user } = await auth.getPosition(JWTtoken);

  if (user?.orgId == null) {
    return {
      status: statusCodes.BAD_REQUEST,
    };
  }

  try {
    if (status == 200 && user) {
      if (user.role != "viewer") {
        await prisma.teacher.deleteMany({
          where: {
            OR: teachers.map((teacher) => ({
              name: teacher.name,
              orgId: user.orgId as number,
              department:
                user.role == "admin" ? teacher.department : user.department,
            })),
          },
        });
        return {
          status: statusCodes.OK,
        };
      }
      //else
      return {
        status: statusCodes.FORBIDDEN,
      };
    }
    //else
    return {
      status: status,
    };
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function getConsolidated(
  JWTtoken: string
): Promise<{ status: number; consolidatedTable: string[][][] | null }> {
  try{
    const { status, user } = await auth.getPosition(JWTtoken);

    if (status==statusCodes.OK && user?.orgId == null ) {
      return {
        status: statusCodes.BAD_REQUEST,
        consolidatedTable: null,
      };
    }
    let consolidatedTable: string[][][] = Array(6).fill(null).map(() =>
      Array(6).fill(null).map(() =>
        Array(0).fill("")
      )
    );
    let teachers;
    if(user && user.role=="admin" ){
      teachers = await prisma.teacher.findMany({
        where: {
          orgId: user.orgId?user.orgId:-1,
        },
        select: {
          name: true,
          timetable: true,
          labtable: true,
        },
      });
    }
    else if(user){
      teachers = await prisma.teacher.findMany({
        where: {
          orgId: user.orgId?user.orgId:-1,
          department: user.department,
        },
        select: {
          name: true,
          timetable: true,
          labtable: true,
        },
      });
    }
    teachers?.forEach((teacher) => {
      const timetable = teacher.timetable;
      const labtable = teacher.labtable;
      const teacherTable = convertStringToTable(timetable);
      const teacherLabTable = convertStringToTable(labtable);
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if(teacherTable[i][j]=="0" && teacherLabTable[i][j]=="0"){
            consolidatedTable[i][j].push(teacher.name);
          }
        }
      }
    });
    return {consolidatedTable: consolidatedTable, status: statusCodes.OK};
  }
  catch{
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      consolidatedTable: null,
    };
  }
}
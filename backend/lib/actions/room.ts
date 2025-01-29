import * as auth from "./auth";
import { PrismaClient } from "@prisma/client";
import { Room } from "../types/main";
import { statusCodes } from "../types/statusCodes";

const prisma = new PrismaClient();

function convertTableToString(timetable: string[][]): string | null {
  return timetable.map((row) => row.join(",")).join(";");
}

// function convertStringToTable(timetable:string):string[][]{
//     return timetable.split(";").map(row => row.split(","));
// }

//for creating rooms by editors, and admins
export async function createRoom(
  JWTtoken: string,
  name: string,
  lab: boolean,
  timetable: string[][] | null = null,
  department: string | null = null
): Promise<{ status: number; room: Room | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        room: null,
      };
    }

    //if status is ok
    if (status == statusCodes.OK) {
      //check if role can make stuff
      if (user && user.role != "viewer") {
        const room: Room = {
          name: name,
          orgId: user.orgId,
          department: user.department,
          lab: lab,
          timetable:
            "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
        };
        if (timetable) {
          room.timetable = convertTableToString(timetable);
        }
        if (user.role == "admin" && department) {
          room.department = department;
        }
        //first check if any duplicates there, org dep and name same
        const duplicates = await prisma.room.findFirst({
          where: {
            orgId: room.orgId,
            department: room.department,
            name: name,
          },
        });
        if (duplicates) {
          //bad request
          return {
            status: statusCodes.BAD_REQUEST,
            room: null,
          };
        }
        //if check successfull
        await prisma.room.create({
          data: room,
        });

        //created
        return {
          status: statusCodes.CREATED,
          room: room,
        };
      }
      //else return unauthorised
      return {
        status: statusCodes.FORBIDDEN,
        room: null,
      };
    }
    //not ok
    return {
      status: status,
      room: null,
    };
  } catch {
    //internal error
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      room: null,
    };
  }
}

export async function createManyRoom(
  JWTtoken: string,
  name: string[],
  lab: boolean[],
  department: string | null = null
): Promise<{ status: number; rooms: Room[] | null }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        rooms: null,
      };
    }

    if (status == statusCodes.OK) {
      if (user && user.role != "viewer") {
        const rooms: Room[] = [];

        for (let i = 0; i < name.length; i++) {
          rooms.push({
            name: name[i],
            orgId: user.orgId,
            department: department ? department : user.department,
            lab: lab[i],
            timetable:
              "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0",
          });
        }
        const duplicateChecks = await Promise.all(
          rooms.map((room) =>
            prisma.room.findFirst({
              where: {
                orgId: room.orgId,
                department: room.department,
                name: room.name,
              },
            })
          )
        );

        if (duplicateChecks.some((duplicate) => duplicate)) {
          return {
            status: statusCodes.BAD_REQUEST,
            rooms: rooms.filter((room, index) => duplicateChecks[index]),
          };
        }

        //if no duplicates, create rooms
        await prisma.room.createMany({
          data: rooms,
        });

        return {
          status: statusCodes.CREATED,
          rooms: rooms,
        };
      }
      return {
        status: statusCodes.FORBIDDEN,
        rooms: null,
      };
    }
    return {
      status: status,
      rooms: null,
    };
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      rooms: null,
    };
  }
}

export async function updateRoom(
  JWTtoken: string,
  originalName: string,
  originalDepartment: string | null = null,
  room: Room
): Promise<{ status: number }> {
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
      };
    }

    if (status == statusCodes.OK && user) {
      if (user.role != "viewer") {
        const existingRoom = await prisma.room.findFirst({
          where: {
            orgId: user.orgId,
            department:
              user.role == "admin" ? originalDepartment : user.department,
            name: originalName,
          },
        });

        if (!existingRoom) {
          return {
            status: statusCodes.NOT_FOUND,
          };
        }

        await prisma.room.update({
          where: {
            id: existingRoom.id,
          },
          data: {
            name: room.name,
            department:
              user.role == "admin" && room.department
                ? room.department
                : user.department,
            lab: room.lab,
            timetable: room.timetable,
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
  } catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}
type RoomWithId = {
  id: number;
  name: string;
  orgId: number;
  department: string | null;
  lab: boolean | null;
  timetable: string | null;
};
export async function getRooms(
  token: string
): Promise<{ status: number; rooms: RoomWithId[] | null }> {
  try {
    //get position of user
    const { status, user } = await auth.getPosition(token);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        rooms: null,
      };
    }

    if (status == statusCodes.OK && user) {
      //find all the clasrooms in his lab
      let rooms: RoomWithId[];
      if (user.role != "admin") {
        rooms = await prisma.room
          .findMany({
            where: {
              orgId: user.orgId,
              department: user.department,
            },
            select: {
              id: true,
              name: true,
              department: true,
              lab: true,
              orgId: true,
              timetable: true,
            },
          });
      } else {
        rooms = await prisma.room
          .findMany({
            where: {
              orgId: user.orgId,
            },
            select: {
              id: true,
              name: true,
              department: true,
              lab: true,
              orgId: true,
              timetable: true,
            },
          })
      }
      return {
        status: statusCodes.OK,
        rooms: rooms,
      };
    } else {
      return {
        status: status,
        rooms: null,
      };
    }
  } catch {
    //internal error
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      rooms: null,
    };
  }
}

export async function peekRoom(
  token: string,
  name: string,
  department: string | null = null
): Promise<{ status: number; room: Room | null }> {
  try {
    //get position of user
    const { status, user } = await auth.getPosition(token);

    if (user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        room: null,
      };
    }

    if (status == statusCodes.OK && user) {
      //find all the clasrooms in his lab
      let room
      console.log(user.role)
      if(user.role=="admin"){
        console.log("admin found!")
        room = await prisma.room.findFirst({
          where: {
            name: name,
            orgId: user.orgId
          },
        });
        console.log("\nrooms:",room)
      }
      else{
        room = await prisma.room.findFirst({
          where: {
            name: name,
            department:user.department,//if user is admin, refer the department passed in peekRoom(if a department isnt passed, the admins department is used), else use users deparment
            orgId: user.orgId
          },
        });
      }
      return {
        status: statusCodes.OK,
        room: room,
      };
    } else {
      return {
        status: status,
        room: null,
      };
    }
  } catch {
    //internal error
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      room: null,
    };
  }
}

export async function deleteRooms(
  JWTtoken: string,
  rooms: Room[]
): Promise<{ status: number }> {
  const { status, user } = await auth.getPosition(JWTtoken);

  if (user?.orgId == null) {
    return {
      status: statusCodes.BAD_REQUEST,
    };
  }

  try {
    if (status == statusCodes.OK && user) {
      if (user.role != "viewer") {
        await prisma.room.deleteMany({
          where: {
            OR: rooms.map((room) => ({
              name: room.name,
              orgId: user.orgId as number,
              department:
                user.role == "admin" ? room.department : user.department,
            })),
          },
        });
        return {
          status: statusCodes.OK,
        };
      }
      // else
      return {
        status: statusCodes.FORBIDDEN,
      };
    }
    // else
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
  try {
    const { status, user } = await auth.getPosition(JWTtoken);

    if (status == statusCodes.OK && user?.orgId == null) {
      return {
        status: statusCodes.BAD_REQUEST,
        consolidatedTable: null,
      };
    }

    let consolidatedTable: string[][][] = Array(6)
      .fill(null)
      .map(() =>
        Array(6)
          .fill(null)
          .map(() => Array(0).fill(""))
      );

    let rooms;
    if (user && user.role == "admin") {
      rooms = await prisma.room.findMany({
        where: {
          orgId: user.orgId ? user.orgId : -1,
        },
        select: {
          name: true,
          timetable: true,
        },
      });
    } else if (user) {
      rooms = await prisma.room.findMany({
        where: {
          orgId: user.orgId ? user.orgId : -1,
          department: user.department,
        },
        select: {
          name: true,
          timetable: true,
        },
      });
    }

    rooms?.forEach((room) => {
      const timetable = room.timetable;
      if (timetable) {
        const roomTable = timetable.split(";").map(row => row.split(","));
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if (roomTable[i][j] == "0") {
              consolidatedTable[i][j].push(room.name);
            }
          }
        }
      }
    });

    return { consolidatedTable: consolidatedTable, status: statusCodes.OK };
  } 
  catch {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      consolidatedTable: null,
    };
  }
}
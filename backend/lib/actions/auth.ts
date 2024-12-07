import jwt from "jsonwebtoken";
import PrismaClientManager from "../pgConnect";
import bcrypt from "bcryptjs";
import { statusCodes } from "../types/statusCodes";
import { User } from "../types/main";

const secretKey = process.env.JWT_SECRET_KEY || "bob";
const prisma = PrismaClientManager.getInstance().getPrismaClient();

export const checkAuthentication = async (token: string): Promise<boolean> => {
  try {
    jwt.verify(token, secretKey); // Verifies the token using the secret key
    return true; // If token is valid, return true
  } catch {
    return false; // If token verification fails, return false
  }
};

export const login = async (
  email: string,
  pass: string
): Promise<{ status: number; token: string }> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        status: statusCodes.NOT_FOUND,
        token: "",
      };
    }

    const validatePass = await bcrypt.compare(pass, user?.hashedPass || "");

    if (!validatePass) {
      return {
        status: statusCodes.UNAUTHORIZED,
        token: "",
      };
    }

    const token = jwt.sign(
      {
        email: user?.email,
        id: user?.id,
        //consider adding organisation and role
      },
      secretKey
    );
    return {
      status: statusCodes.OK,
      token,
    };
  } catch (e) {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      token: "",
    };
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ status: number; token: string }> => {
  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const duplicateUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (duplicateUser) {
      return {
        status: statusCodes.CONFLICT,
        token: "",
      };
    }

    const new_user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPass,
        hasAccess: false,
      },
    });

    const token = jwt.sign(
      {
        email: new_user.email,
        id: new_user.id,
      },
      secretKey
    );

    return {
      status: statusCodes.CREATED,
      token,
    };
  } catch (e) {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      token: "",
    };
  }
};

//the following section defines the functions to recieve and verify the positions of users.

//This is the return type of the fuction

//pass the jwtToken of the user that you want to get the position of.
export async function getPosition(
  JWTtoken: string
): Promise<{ status: number; user: User | null }> {
  try {
    //getting user id from token
    const jwtParsed = jwt.decode(JWTtoken) ;
    const userId = jwtParsed.id;
    const userEmail = jwtParsed.email;
    //find user info from DB using id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      if (user.email == userEmail) {
        //successfull match,and has permission return values
        if (user.hasAccess) {
          const retVal = {
            id: user.id,
            name: user.name,
            organisation: user.organisation,
            role: user.role,
            department: user.department,
          };
          return {
            status: statusCodes.OK,
            user: retVal,
          };
        } else {
          return {
            //not authorised
            status: statusCodes.UNAUTHORIZED,
            user: null,
          };
        }
      } else {
        //illegal request
        return { status: statusCodes.BAD_REQUEST, user: null };
      }
    } else {
      //if the user isnt found
      return { status: statusCodes.NOT_FOUND, user: null };
    }
  } catch {
    //server error ig
    return { status: statusCodes.INTERNAL_SERVER_ERROR, user: null };
  }
}

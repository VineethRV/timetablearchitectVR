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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.checkAuthentication = void 0;
exports.getPosition = getPosition;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pgConnect_1 = __importDefault(require("../pgConnect"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const statusCodes_1 = require("../types/statusCodes");
const secretKey = 'bob';
const prisma = pgConnect_1.default.getInstance().getPrismaClient();
const checkAuthentication = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        jsonwebtoken_1.default.verify(token, secretKey); // Verifies the token using the secret key
        return true; // If token is valid, return true
    }
    catch (_a) {
        return false; // If token verification fails, return false
    }
});
exports.checkAuthentication = checkAuthentication;
const login = (email, pass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return {
                status: statusCodes_1.statusCodes.NOT_FOUND,
                token: "",
            };
        }
        const validatePass = yield bcryptjs_1.default.compare(pass, (user === null || user === void 0 ? void 0 : user.hashedPass) || "");
        if (!validatePass) {
            return {
                status: statusCodes_1.statusCodes.UNAUTHORIZED,
                token: "",
            };
        }
        const token = jsonwebtoken_1.default.sign({
            email: user === null || user === void 0 ? void 0 : user.email,
            id: user === null || user === void 0 ? void 0 : user.id,
            //consider adding organisation and role
        }, secretKey);
        return {
            status: statusCodes_1.statusCodes.OK,
            token,
        };
    }
    catch (e) {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            token: "",
        };
    }
});
exports.login = login;
const register = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        const duplicateUser = yield prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (duplicateUser) {
            return {
                status: statusCodes_1.statusCodes.CONFLICT,
                token: "",
            };
        }
        const new_user = yield prisma.user.create({
            data: {
                name,
                email,
                hashedPass,
                hasAccess: false,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            email: new_user.email,
            id: new_user.id,
        }, secretKey);
        return {
            status: statusCodes_1.statusCodes.CREATED,
            token,
        };
    }
    catch (e) {
        return {
            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
            token: "",
        };
    }
});
exports.register = register;
//the following section defines the functions to recieve and verify the positions of users.
//This is the return type of the fuction
//pass the jwtToken of the user that you want to get the position of.
function getPosition(JWTtoken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //getting user id from token
            const jwtParsed = jsonwebtoken_1.default.decode(JWTtoken);
            const userId = jwtParsed.id;
            const userEmail = jwtParsed.email;
            //find user info from DB using id
            const user = yield prisma.user.findUnique({ where: { id: userId } });
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
                            status: statusCodes_1.statusCodes.OK,
                            user: retVal,
                        };
                    }
                    else {
                        return {
                            //not authorised
                            status: statusCodes_1.statusCodes.UNAUTHORIZED,
                            user: null,
                        };
                    }
                }
                else {
                    //illegal request
                    return { status: statusCodes_1.statusCodes.BAD_REQUEST, user: null };
                }
            }
            else {
                //if the user isnt found
                return { status: statusCodes_1.statusCodes.NOT_FOUND, user: null };
            }
        }
        catch (_a) {
            //server error ig
            return { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, user: null };
        }
    });
}

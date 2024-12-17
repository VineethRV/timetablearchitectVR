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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onboard = Onboard;
exports.ApproveAccess = ApproveAccess;
var client_1 = require("@prisma/client");
var statusCodes_1 = require("../types/statusCodes");
var auth_1 = require("./auth");
var prisma = new client_1.PrismaClient();
function Onboard(token, name, dept, sections, teachers, students, depts_list) {
    return __awaiter(this, void 0, void 0, function () {
        var access, user, duplicateOrg, organisation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!token) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.UNAUTHORIZED,
                            }];
                    }
                    return [4 /*yield*/, (0, auth_1.checkAuthentication)(token)];
                case 1:
                    access = _a.sent();
                    if (!access) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.UNAUTHORIZED,
                            }];
                    }
                    return [4 /*yield*/, (0, auth_1.getPosition)(token)];
                case 2:
                    user = _a.sent();
                    if (!user || !user.user) {
                        console.log("No user found or user object is missing.");
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.NOT_FOUND }];
                    }
                    return [4 /*yield*/, prisma.organisation.findFirst({
                            where: {
                                name: name,
                            },
                        })];
                case 3:
                    duplicateOrg = _a.sent();
                    if (duplicateOrg) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.CONFLICT,
                            }];
                    }
                    return [4 /*yield*/, prisma.organisation.create({
                            data: {
                                name: name,
                                no_of_sections: sections,
                                no_of_teachers: teachers,
                                no_of_students: students,
                                depts_list: depts_list.join(","),
                            },
                        })];
                case 4:
                    organisation = _a.sent();
                    if (!user.user) return [3 /*break*/, 6];
                    // Ensure the user is updated in the database if necessary
                    return [4 /*yield*/, prisma.user.update({
                            where: { id: user.user.id },
                            data: {
                                role: "Admin",
                                department: dept,
                                organisation: {
                                    connect: { id: organisation.id }, // Connect the organisation using its ID
                                },
                            },
                        })];
                case 5:
                    // Ensure the user is updated in the database if necessary
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.CREATED,
                    }];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error during onboarding:", error_1);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
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
function ApproveAccess(token, tokenApprover, position) {
    return __awaiter(this, void 0, void 0, function () {
        var user, approver, error_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, auth_1.getPosition)(token)];
                case 1:
                    user = _e.sent();
                    return [4 /*yield*/, (0, auth_1.getPosition)(tokenApprover)];
                case 2:
                    approver = _e.sent();
                    if (((_a = approver.user) === null || _a === void 0 ? void 0 : _a.role) != "Admin" && ((_b = user.user) === null || _b === void 0 ? void 0 : _b.orgId) != ((_c = approver.user) === null || _c === void 0 ? void 0 : _c.orgId)) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                            }];
                    }
                    if (!user) {
                        return [2 /*return*/, {
                                status: statusCodes_1.statusCodes.NOT_FOUND,
                            }];
                    }
                    return [4 /*yield*/, prisma.user.update({
                            where: {
                                id: (_d = user.user) === null || _d === void 0 ? void 0 : _d.id
                            },
                            data: {
                                role: position, // Setting the role to the passed position
                                hasAccess: true, // Setting hasAccess to true
                            },
                        })];
                case 3:
                    _e.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CREATED, // Successfully updated
                        }];
                case 4:
                    error_2 = _e.sent();
                    console.error("Error updating user access:", error_2);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}

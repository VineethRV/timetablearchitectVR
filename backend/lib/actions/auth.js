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
exports.register = exports.login = exports.checkAuthentication = void 0;
exports.getPosition = getPosition;
exports.sendVerificationEmail = sendVerificationEmail;
exports.checkUserExists = checkUserExists;
exports.changePassword = changePassword;
exports.verifyOTP = verifyOTP;
exports.forgetOTP = forgetOTP;
exports.verifyEmail = verifyEmail;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var pgConnect_1 = require("../pgConnect");
var statusCodes_1 = require("../types/statusCodes");
var secretKey = process.env.JWT_SECRET_KEY || "bob";
var prisma = pgConnect_1.default.getInstance().getPrismaClient();
var officialEmail = process.env.ARCHITECT_EMAIL;
var emailAccessToken = process.env.EMAIL_ACCESS_TOKEN;
var OTP_MANAGER = [];
var transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: officialEmail,
        pass: emailAccessToken,
    },
});
var checkAuthentication = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            jwt.verify(token, secretKey); // Verifies the token using the secret key
            return [2 /*return*/, true]; // If token is valid, return true
        }
        catch (_b) {
            return [2 /*return*/, false]; // If token verification fails, return false
        }
        return [2 /*return*/];
    });
}); };
exports.checkAuthentication = checkAuthentication;
var login = function (email, pass) { return __awaiter(void 0, void 0, void 0, function () {
    var user, validatePass, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.NOT_FOUND,
                            token: "",
                        }];
                }
                if (!(user === null || user === void 0 ? void 0 : user.hasAccess)) {
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.NOT_ACCEPTABLE,
                            token: "",
                        }];
                }
                return [4 /*yield*/, bcrypt.compare(pass, (user === null || user === void 0 ? void 0 : user.hashedPass) || "")];
            case 2:
                validatePass = _a.sent();
                if (!validatePass) {
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.UNAUTHORIZED,
                            token: "",
                        }];
                }
                token = jwt.sign({
                    email: user === null || user === void 0 ? void 0 : user.email,
                    id: user === null || user === void 0 ? void 0 : user.id,
                    //consider adding organisation and role
                }, secretKey);
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.OK,
                        token: token,
                    }];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        token: "",
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var register = function (name, email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPass, duplicateUser, new_user, token, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hashedPass = _a.sent();
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                    })];
            case 2:
                duplicateUser = _a.sent();
                if (duplicateUser) {
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.CONFLICT,
                            token: "",
                        }];
                }
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            hashedPass: hashedPass,
                            hasAccess: false,
                        },
                    })];
            case 3:
                new_user = _a.sent();
                token = jwt.sign({
                    email: new_user.email,
                    id: new_user.id,
                }, secretKey);
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.CREATED,
                        token: token,
                    }];
            case 4:
                e_2 = _a.sent();
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        token: e_2,
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
function getPosition(JWTtoken) {
    return __awaiter(this, void 0, void 0, function () {
        var jwtParsed, userId, userEmail, user, retVal, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    jwtParsed = jwt.decode(JWTtoken);
                    userId = jwtParsed.id;
                    userEmail = jwtParsed.email;
                    return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
                case 1:
                    user = _b.sent();
                    if (user) {
                        if (user.email == userEmail) {
                            //successfull match,and has permission return values
                            if (user.hasAccess) {
                                retVal = {
                                    id: user.id,
                                    name: user.name,
                                    organisation: user.organisation,
                                    role: user.role,
                                    department: user.department,
                                };
                                return [2 /*return*/, {
                                        status: statusCodes_1.statusCodes.OK,
                                        user: retVal,
                                    }];
                            }
                            else {
                                return [2 /*return*/, {
                                        //not authorised
                                        status: statusCodes_1.statusCodes.UNAUTHORIZED,
                                        user: null,
                                    }];
                            }
                        }
                        else {
                            //illegal request
                            return [2 /*return*/, { status: statusCodes_1.statusCodes.BAD_REQUEST, user: null }];
                        }
                    }
                    else {
                        //if the user isnt found
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.NOT_FOUND, user: null }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    //server error ig
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR, user: null }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sendVerificationEmail(username, email) {
    return __awaiter(this, void 0, void 0, function () {
        var emailVerificationHtml, token, receiver, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    emailVerificationHtml = "<!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Email Verification</title>\n    <style>\n      body {\n        font-family: Arial, sans-serif;\n        margin: 0;\n        padding: 0;\n        background-color: #f4f4f9;\n      }\n      .container {\n        max-width: 600px;\n        margin: 40px auto;\n        background: #ffffff;\n        padding: 20px;\n        border-radius: 8px;\n        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n        border: 1px solid #ddd;\n      }\n      .header {\n        text-align: center;\n        padding: 20px 0;\n      }\n      .header h1 {\n        color: #333;\n        font-size: 24px;\n        margin: 0;\n      }\n      .message-box {\n        text-align: center;\n        margin: 20px 0;\n      }\n      .message-box h2 {\n        font-size: 20px;\n        color: #007bff;\n        margin: 0 0 10px;\n      }\n      .content {\n        font-size: 16px;\n        color: #555;\n        line-height: 1.5;\n        text-align: center;\n        margin-bottom: 20px;\n      }\n      .verify-button {\n        display: inline-block;\n        background-color: #007bff;\n        color: #fff;\n        padding: 12px 24px;\n        font-size: 16px;\n        text-decoration: none;\n        border-radius: 5px;\n        margin: 20px 0;\n      }\n      .verify-button:hover {\n        background-color: #0056b3;\n      }\n      .footer {\n        text-align: center;\n        margin-top: 30px;\n        font-size: 14px;\n        color: #aaa;\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"header\">\n        <h1>Welcome to Our Platform</h1>\n      </div>\n      <div class=\"content\">\n        <p>Hi {{USER_NAME}},</p>\n        <p>Thank you for signing up! Please click the button below to verify your email address and activate your account:</p>\n      </div>\n      <div class=\"message-box\">\n        <a href=\"{{VERIFICATION_LINK}}\" class=\"verify-button\">Verify Email</a>\n      </div>\n      <div class=\"content\">\n        <p>If you didn\u2019t sign up for this account, please disregard this message.</p>\n      </div>\n      <div class=\"footer\">\n        <p>&copy; 2024 Your Company. All rights reserved.</p>\n      </div>\n    </div>\n  </body>\n  </html>";
                    emailVerificationHtml = emailVerificationHtml.replace("{{USER_NAME}}", username);
                    token = jwt.sign({
                        email: email,
                    }, secretKey);
                    emailVerificationHtml = emailVerificationHtml.replace("{{VERIFICATION_LINK}}", "https://timetablearchitect.vercel.app/auth/verify-email?token=".concat(token));
                    receiver = {
                        from: officialEmail,
                        to: email,
                        subject: "Email Verification Link",
                        html: emailVerificationHtml,
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transport.sendMail(receiver)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, true];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkUserExists(email) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: {
                                email: email,
                            },
                        })];
                case 1:
                    user = _b.sent();
                    if (user)
                        return [2 /*return*/, true];
                    return [2 /*return*/, false];
                case 2:
                    _a = _b.sent();
                    throw new Error("DB error");
                case 3: return [2 /*return*/];
            }
        });
    });
}
function changePassword(verificationToken, email, new_password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPass, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    // verify token
                    jwt.verify(verificationToken, secretKey);
                    return [4 /*yield*/, bcrypt.hash(new_password, 10)];
                case 1:
                    hashedPass = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, prisma.user.update({
                            where: {
                                email: email,
                            },
                            data: {
                                hashedPass: hashedPass,
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 4:
                    _a = _c.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 5: return [3 /*break*/, 7];
                case 6:
                    _b = _c.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.BAD_REQUEST }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function verifyOTP(email, otp) {
    return __awaiter(this, void 0, void 0, function () {
        var index, token;
        return __generator(this, function (_a) {
            index = OTP_MANAGER.findIndex(function (item) { return item.email === email && item.otp === otp; });
            // if not found return saying otp is invalid
            if (index == -1) {
                return [2 /*return*/, {
                        status: statusCodes_1.statusCodes.BAD_REQUEST,
                        token: "",
                    }];
            }
            // remove the otp
            OTP_MANAGER.splice(index, 1);
            token = jwt.sign({ otp: otp }, secretKey);
            return [2 /*return*/, {
                    status: statusCodes_1.statusCodes.OK,
                    token: token,
                }];
        });
    });
}
function forgetOTP(email) {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_3, otpCode, htmlContent, receiver, info, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, checkUserExists(email)];
                case 1:
                    res = _b.sent();
                    if (!res) {
                        return [2 /*return*/, { status: statusCodes_1.statusCodes.BAD_REQUEST }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _b.sent();
                    return [2 /*return*/, { status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR }];
                case 3:
                    otpCode = Math.floor(100000 + Math.random() * 900000);
                    htmlContent = "<!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>OTP Verification</title>\n    <style>\n      body {\n        font-family: Arial, sans-serif;\n        margin: 0;\n        padding: 0;\n        background-color: #f9f9f9;\n      }\n      .container {\n        max-width: 600px;\n        margin: 40px auto;\n        background: #ffffff;\n        padding: 20px;\n        border-radius: 8px;\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n        border: 1px solid #e3e3e3;\n      }\n      .header {\n        text-align: center;\n        padding: 20px 0;\n      }\n      .header h1 {\n        color: #2c3e50;\n        font-size: 24px;\n      }\n      .otp-box {\n        text-align: center;\n        margin: 30px 0;\n      }\n      .otp-box h2 {\n        font-size: 28px;\n        color: #3498db;\n        margin: 0;\n      }\n      .content {\n        font-size: 16px;\n        color: #7f8c8d;\n        line-height: 1.6;\n        text-align: center;\n      }\n      .footer {\n        text-align: center;\n        margin-top: 30px;\n        font-size: 14px;\n        color: #bdc3c7;\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"header\">\n        <h1>Architect Developers</h1>\n      </div>\n      <div class=\"content\">\n        <p>Hello,</p>\n        <p>Please use the OTP code below to verify your identity:</p>\n      </div>\n      <div class=\"otp-box\">\n        <h2>{{OTP_CODE}}</h2>\n      </div>\n      <div class=\"content\">\n        <p>If you didn\u2019t request this code, please ignore this email.</p>\n      </div>\n      <div class=\"footer\">\n        <p>&copy; 2024 Architect Developers. All rights reserved.</p>\n      </div>\n    </div>\n  </body>\n  </html>\n  ";
                    receiver = {
                        from: officialEmail,
                        to: email,
                        subject: "Password Reset: OTP Verification Code",
                        html: htmlContent.replace("{{OTP_CODE}}", otpCode.toString()),
                    };
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, transport.sendMail(receiver)];
                case 5:
                    info = _b.sent();
                    console.log("Email sent: " + info.response);
                    OTP_MANAGER.push({ otp: otpCode, email: email });
                    // make sure to delete it after 5 min
                    setTimeout(function () {
                        var index = OTP_MANAGER.findIndex(function (item) { return item.email === email && item.otp === otpCode; });
                        if (index !== -1) {
                            OTP_MANAGER.splice(index, 1);
                        }
                    }, 5 * 60 * 1000);
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.OK,
                        }];
                case 6:
                    _a = _b.sent();
                    return [2 /*return*/, {
                            status: statusCodes_1.statusCodes.INTERNAL_SERVER_ERROR,
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function verifyEmail(token) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, email, user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    jwt.verify(token, secretKey);
                    payload = jwt.decode(token);
                    email = payload.email;
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: {
                                email: email,
                            },
                        })];
                case 1:
                    user = _b.sent();
                    if (user === null || user === void 0 ? void 0 : user.hasAccess) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, prisma.user.update({
                            where: {
                                email: email,
                            },
                            data: {
                                hasAccess: true,
                            },
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, true];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}

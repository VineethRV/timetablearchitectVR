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
const client_1 = require("@prisma/client");
class PrismaClientManager {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!PrismaClientManager.instance) {
            PrismaClientManager.instance = new PrismaClientManager();
        }
        return PrismaClientManager.instance;
    }
    getPrismaClient() {
        return this.prismaClient;
    }
    checkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prismaClient.$queryRaw `SELECT 'OK!' as result`;
            }
            catch (e) {
                return false;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$disconnect();
        });
    }
}
exports.default = PrismaClientManager;

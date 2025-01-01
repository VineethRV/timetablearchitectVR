"use strict";
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
    async checkStatus() {
        try {
            return await this.prismaClient.$queryRaw `SELECT 'OK!' as result`;
        }
        catch (e) {
            return false;
        }
    }
    async disconnect() {
        await this.prismaClient.$disconnect();
    }
}
exports.default = PrismaClientManager;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verwijderById = exports.voegToeById = exports.getById = exports.getAll = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const roles_1 = __importDefault(require("../core/roles"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const ORDER_SELECT = {
    id: true,
    date: true,
    user: {
        select: {
            id: true,
            name: true,
        }
    },
    orderproduct: {
        select: {
            orderId: true,
            productId: true,
            aantal: true,
        }
    },
};
const getAll = async (roles, userId) => {
    return data_1.prisma.order.findMany({
        where: roles.includes(roles_1.default.ADMIN) ? {} : { user_id: userId },
        select: ORDER_SELECT,
    });
};
exports.getAll = getAll;
const getById = async (orderId, roles, userId) => {
    const extraFilter = roles.includes(roles_1.default.ADMIN) ? {} : { user_id: userId };
    const id = Number(orderId);
    const order = await data_1.prisma.order.findUnique({
        where: {
            id,
            ...extraFilter
        },
        select: ORDER_SELECT,
    });
    if (!order) {
        throw serviceError_1.default.notFound('Geen order met dit id');
    }
    return order;
};
exports.getById = getById;
const voegToeById = async (input) => {
    try {
        return await data_1.prisma.order.create({
            data: {
                user_id: input.userId,
                date: input.date
            },
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.voegToeById = voegToeById;
const verwijderById = async (orderId, roles, userId) => {
    try {
        const extraFilter = roles.includes(roles_1.default.ADMIN) ? {} : { user_id: userId };
        const id = Number(orderId);
        await data_1.prisma.order.delete({
            where: {
                id,
                ...extraFilter
            }
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.verwijderById = verwijderById;

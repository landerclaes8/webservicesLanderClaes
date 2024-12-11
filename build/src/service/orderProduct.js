"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByOrderProductId = exports.deleteByOrderId = exports.voegtoe = exports.getByOrderId = exports.getAll = void 0;
const data_1 = require("../data");
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const ORDERPRODUCT_SELECT = {
    orderId: true,
    productId: true,
    aantal: true,
};
const getAll = async () => {
    return data_1.prisma.orderProduct.findMany({
        select: ORDERPRODUCT_SELECT,
    });
};
exports.getAll = getAll;
const getByOrderId = async (orderId) => {
    const order_Id = Number(orderId);
    const order = data_1.prisma.orderProduct.findMany({
        where: {
            orderId: order_Id,
        },
        select: ORDERPRODUCT_SELECT,
    });
    return order;
};
exports.getByOrderId = getByOrderId;
const voegtoe = async (input) => {
    try {
        return await data_1.prisma.orderProduct.create({
            data: input,
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.voegtoe = voegtoe;
const deleteByOrderId = async (orderId) => {
    try {
        const order_id = Number(orderId);
        await data_1.prisma.orderProduct.deleteMany({
            where: {
                orderId: order_id,
            }
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)('niet verwijderd');
    }
};
exports.deleteByOrderId = deleteByOrderId;
const deleteByOrderProductId = async (orderId, productId) => {
    try {
        const order_id = Number(orderId);
        await data_1.prisma.orderProduct.delete({
            where: {
                orderId_productId: {
                    orderId: order_id,
                    productId: productId,
                },
            }
        });
    }
    catch (error) {
        console.log(error.message);
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.deleteByOrderProductId = deleteByOrderProductId;

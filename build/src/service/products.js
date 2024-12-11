"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateProductById = exports.createProduct = exports.getById = exports.getAll = void 0;
const data_1 = require("../data");
const serviceError_1 = __importDefault(require("../core/serviceError"));
const _handleDBError_1 = __importDefault(require("./_handleDBError"));
const roles_1 = __importDefault(require("../core/roles"));
const PRODUCT_SELECT = {
    id: true,
    prijs: true,
    soort: true,
    merk: true,
    kleur: true,
    maat: true,
    stofsoort: true,
};
const getAll = async () => {
    return data_1.prisma.product.findMany({
        select: PRODUCT_SELECT
    });
};
exports.getAll = getAll;
const getById = async (id) => {
    const product = await data_1.prisma.product.findUnique({
        where: {
            id,
        }, select: PRODUCT_SELECT
    });
    if (!product) {
        throw serviceError_1.default.notFound('No product with this id exists');
    }
    ;
    return product;
};
exports.getById = getById;
const createProduct = async (product, roles) => {
    if (!roles.includes(roles_1.default.ADMIN)) {
        throw serviceError_1.default.forbidden('Acces denied');
    }
    try {
        return await data_1.prisma.product.create({
            data: product,
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
};
exports.createProduct = createProduct;
const updateProductById = async (id, changes, roles) => {
    if (!roles.includes(roles_1.default.ADMIN)) {
        throw serviceError_1.default.forbidden('Acces denied');
    }
    try {
        return await data_1.prisma.product.update({
            where: {
                id,
            },
            data: changes,
        });
    }
    catch (error) {
        throw (0, _handleDBError_1.default)(error);
    }
    ;
};
exports.updateProductById = updateProductById;
const deleteById = async (id, roles) => {
    if (!roles.includes(roles_1.default.ADMIN)) {
        throw serviceError_1.default.forbidden('Acces denied');
    }
    try {
        await data_1.prisma.product.delete({
            where: {
                id,
            },
        });
    }
    catch (error) {
        throw ((0, _handleDBError_1.default)(error));
    }
    ;
};
exports.deleteById = deleteById;

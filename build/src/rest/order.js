"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const orderService = __importStar(require("../service/order"));
const orderProductService = __importStar(require("../service/orderProduct"));
const joi_1 = __importDefault(require("joi"));
const validation_1 = __importDefault(require("../core/validation"));
const auth_1 = require("../core/auth");
const getAllOrders = async (ctx) => {
    ctx.body = {
        items: await orderService.getAll(ctx.state.session.roles, ctx.state.session.userId)
    };
};
getAllOrders.validationScheme = null;
const getOrderById = async (ctx) => {
    ctx.body = await orderService.getById(ctx.params.id, ctx.state.session.roles, ctx.state.session.userId);
};
getOrderById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive().required(),
    }
};
const voegOrderToe = async (ctx) => {
    const newOrder = await orderService.voegToeById({
        userId: ctx.state.session.userId,
        date: new Date(),
        orderProducts: ctx.request.body.orderProducts,
    });
    const orderProducts = ctx.request.body.orderProducts.map((op) => ({
        orderId: newOrder.id,
        productId: op.productId,
        aantal: op.aantal,
    }));
    await Promise.all(orderProducts.map(orderProductService.voegtoe));
    ctx.status = 201;
    ctx.body = newOrder, orderProducts;
};
voegOrderToe.validationScheme = {
    body: {
        orderProducts: joi_1.default.array()
    }
};
const verwijderOrder = async (ctx) => {
    await orderService.verwijderById(ctx.params.id, ctx.state.session.roles, ctx.state.session.userId);
    await orderProductService.deleteByOrderId(ctx.params.id);
    ctx.status = 204;
};
verwijderOrder.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/orders',
    });
    router.use(auth_1.requireAuthentication);
    router.get('/', (0, validation_1.default)(getAllOrders.validationScheme), getAllOrders);
    router.post('/', (0, validation_1.default)(voegOrderToe.validationScheme), voegOrderToe);
    router.get('/:id', (0, validation_1.default)(getOrderById.validationScheme), getOrderById);
    router.delete('/:id', (0, validation_1.default)(verwijderOrder.validationScheme), verwijderOrder);
    parent.use(router.routes())
        .use(router.allowedMethods());
};

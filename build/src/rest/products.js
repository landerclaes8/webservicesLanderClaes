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
const productService = __importStar(require("../service/products"));
const joi_1 = __importDefault(require("joi"));
const validation_1 = __importDefault(require("../core/validation"));
const auth_1 = require("../core/auth");
const getAllProducts = async (ctx) => {
    const products = await productService.getAll();
    ctx.body = {
        items: products
    };
};
getAllProducts.validationScheme = null;
const getProductById = async (ctx) => {
    const product = await productService.getById(Number(ctx.params.id));
    ctx.body = product;
};
getProductById.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    }
};
const createProduct = async (ctx) => {
    const product = await productService.createProduct(ctx.request.body, ctx.state.session.roles);
    ctx.status = 201;
    ctx.body = product;
};
createProduct.validationScheme = {
    body: {
        prijs: joi_1.default.number().positive().required(),
        soort: joi_1.default.string().required(),
        merk: joi_1.default.string().required(),
        kleur: joi_1.default.string().required(),
        maat: joi_1.default.string().required(),
        stofsoort: joi_1.default.string().required(),
    }
};
const updateProduct = async (ctx) => {
    const product = await productService.updateProductById(Number(ctx.params.id), ctx.request.body, ctx.state.session.roles);
    ctx.body = product;
};
updateProduct.validationScheme = {
    body: {
        prijs: joi_1.default.number().positive().required(),
        soort: joi_1.default.string().required(),
        merk: joi_1.default.string().required(),
        kleur: joi_1.default.string().required(),
        maat: joi_1.default.string().required(),
        stofsoort: joi_1.default.string().required(),
    }
};
const deleteProduct = async (ctx) => {
    await productService.deleteById(Number(ctx.params.id), ctx.state.session.roles);
    ctx.status = 204;
};
deleteProduct.validationScheme = {
    params: {
        id: joi_1.default.number().integer().positive(),
    },
};
exports.default = (parent) => {
    const router = new router_1.default({
        prefix: '/products',
    });
    router.use(auth_1.requireAuthentication);
    router.get('/', (0, validation_1.default)(getAllProducts.validationScheme), getAllProducts);
    router.get('/:id', (0, validation_1.default)(getProductById.validationScheme), getProductById);
    router.post('/', (0, validation_1.default)(createProduct.validationScheme), createProduct);
    router.put('/:id', (0, validation_1.default)(updateProduct.validationScheme), updateProduct);
    router.delete('/:id', (0, validation_1.default)(deleteProduct.validationScheme), deleteProduct);
    parent.use(router.routes())
        .use(router.allowedMethods());
};

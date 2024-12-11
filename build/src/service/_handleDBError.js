"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceError_1 = __importDefault(require("../core/serviceError"));
const handleDBError = (error) => {
    const { code = '', message } = error;
    if (code === 'P2002') {
        switch (true) {
            case (error.meta && error.meta.target && error.meta.target.includes('Product')):
                throw serviceError_1.default.validationFailed('Een product met dezelfde waarde bestaat al.');
            case message.includes('idx_user_email_unique'):
                throw serviceError_1.default.validationFailed('Er bestaat al een user met dit email-adres');
            case message.includes('idx_user_name_unique'):
                throw serviceError_1.default.validationFailed('Er bestaat al een user met deze naam');
            default:
                throw serviceError_1.default.validationFailed('The item already exists');
        }
    }
    if (code === 'P2025') {
        switch (true) {
            case message.includes('fk_user'):
                throw serviceError_1.default.notFound('This user does not exist');
            case message.includes('fk_product_orderProduct'):
                throw serviceError_1.default.notFound('This product does not exist');
            case message.includes('fk_order'):
                throw serviceError_1.default.notFound('This order does not exist');
            case message.includes('user'):
                throw serviceError_1.default.notFound('No user with this id exists');
            case message.includes('order'):
                throw serviceError_1.default.notFound('No order with this id exists');
            case message.includes('product'):
                throw serviceError_1.default.notFound('No product with this id exists');
        }
    }
};
exports.default = handleDBError;

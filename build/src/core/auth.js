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
exports.authDelay = exports.makeRequireRole = exports.requireAuthentication = void 0;
const config_1 = __importDefault(require("config"));
const userService = __importStar(require("../service/user"));
const AUTH_MAX_DELAY = config_1.default.get('auth.maxDelay');
const requireAuthentication = async (ctx, next) => {
    const { authorization } = ctx.headers;
    ctx.state.session = await userService.checkAndParseSession(authorization);
    return next();
};
exports.requireAuthentication = requireAuthentication;
const makeRequireRole = (role) => async (ctx, next) => {
    const { roles = [] } = ctx.state.session;
    userService.checkRole(role, roles);
    return next();
};
exports.makeRequireRole = makeRequireRole;
const authDelay = async (_, next) => {
    await new Promise((resolve) => {
        const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
        setTimeout(resolve, delay);
    });
    return next();
};
exports.authDelay = authDelay;
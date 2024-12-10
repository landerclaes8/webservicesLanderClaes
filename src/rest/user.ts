import type { Next } from 'koa';
import Router from '@koa/router';
import Joi from 'joi';
import * as userService from '../service/user';
import type { WebstoreContext, WebstoreState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
  GetUserRequest,
} from '../types/user';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole, authDelay } from '../core/auth';
import Role from '../core/roles';


const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {Object[]} users List of users.
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 */
const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

/**
 * @api {post} /users Register a new user
 * @apiName RegisterUser
 * @apiGroup Users
 * @apiBody {String} email User's email.
 * @apiBody {String} password User's password.
 * @apiSuccess {Object} user Registered user details.
 * @apiError (400) VALIDATION_FAILED
 */

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterUserRequest>) => {
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(12).max(128),
  },
};

/**
 * @api {get} /users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup Users
 * @apiPermission user
 * @apiParam {String} id User's unique ID.
 * @apiSuccess {Object} user User details.
 * @apiError (404) NOT_FOUND No user with this id exists
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (400) VALIDATION_FAILED
 */

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

/**
 * @api {put} /users/:id Update user
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiPermission user
 * @apiParam {String} id User's unique ID.
 * @apiBody {String} [email] User's email.
 * @apiBody {String} [password] User's password.
 * @apiSuccess {Object} user Updated user details.
 * @apiError (404) NOT_FOUND No user with this id exists
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (400) VALIDATION_FAILED
 */

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

/**
 * @api {delete} /users/:id Delete user by ID
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission admin
 * @apiParam {String} id User's unique ID.
 * @apiSuccess {Void} 204 No Content.
 * @apiError (404) NOT_FOUND No user with this id exists
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (400) VALIDATION_FAILED
 * @apiError (401) UNAUTHORIZED The token has expired
 */

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<WebstoreState, WebstoreContext>({ prefix: '/users' });

  router.post(
    '/',
    authDelay,
    validate(registerUser.validationScheme),
    registerUser,
  );

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/',
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers,
  );
  router.get(
    '/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById,
  );
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById,
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};

import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/user';
import { authDelay } from '../core/auth'; // Adjust the import path as necessary
import type {
  KoaContext,
  KoaRouter,
  WebstoreState,
  WebstoreContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/user';

/**
 * @api {post} /sessions Login
 * @apiName Login
 * @apiGroup Sessions
 * @apiDescription User session management
 * @apiBody {String} email The email of the user to login.
 * @apiBody {String} password The password of the user to login.
 * @apiSuccess {String} token A JWT token.
 * @apiError (400) BadRequest The request was invalid.
 * @apiError (401) Unauthorized The credentials were invalid.
 */

const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);
  
  ctx.status = 200;
  ctx.body = { token };
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};


export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<WebstoreState, WebstoreContext>({
    prefix: '/sessions',
  });

  router.post('/', authDelay, validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}

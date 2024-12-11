import Router from '@koa/router';
import * as healthService from '../service/health';
import type { PingResponse, VersionResponse } from '../types/health';
import { KoaContext, KoaRouter, WebstoreState, WebstoreContext } from '../types/koa';
import validate from '../core/validation';



/**
 * @api {get} /api/health/ping Ping the server
 * @apiName Ping
 * @apiGroup Health
 * @apiSuccess {String} message Pong message.
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
    ctx.status = 200;
    ctx.body = healthService.ping();
  };

  ping.validationscheme = null;
  
  /**
 * @api {get} /api/health/version Get server version
 * @apiName GetVersion
 * @apiGroup Health
 * @apiSuccess {String} version Server version.
 */
  const getVersion = async (ctx: KoaContext<VersionResponse>) => {
    ctx.status = 200;
    ctx.body = healthService.getVersion();
  };

  getVersion.validationScheme = null;


  export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({ prefix: '/health' });

    router.get('/ping', validate(ping.validationscheme), ping);
    router.get('/version', validate(getVersion.validationScheme), getVersion);
  
    parent.use(router.routes() as any).use(router.allowedMethods() as any);
  };
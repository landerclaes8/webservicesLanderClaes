import Router from '@koa/router';
import * as healthService from '../service/health';
import type { PingResponse, VersionResponse } from '../types/health';
import { KoaContext, KoaRouter, WebstoreState, WebstoreContext } from '../types/koa';



/**
 * @api {get} /health/ping Ping the server
 * @apiName Ping
 * @apiGroup Health
 * @apiSuccess {String} message Pong message.
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
    ctx.status = 200;
    ctx.body = healthService.ping();
  };
  
  /**
 * @api {get} /health/version Get server version
 * @apiName GetVersion
 * @apiGroup Health
 * @apiSuccess {String} version Server version.
 */
  const getVersion = async (ctx: KoaContext<VersionResponse>) => {
    ctx.status = 200;
    ctx.body = healthService.getVersion();
  };


  export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({ prefix: '/health' });

    router.get('/ping', ping);
    router.get('/version', getVersion);
  
    parent.use(router.routes() as any).use(router.allowedMethods() as any);
  };
import Router from '@koa/router';
import installOrderRouter from './order';
import installHealthRouter from './health';
import installProductsRouter from './products';
import installUserRouter from './user'
import installSessionRouter from './session';
import { KoaApplication, WebstoreContext, WebstoreState } from '../types/koa';


export default (app: KoaApplication) => {
    const router = new Router<WebstoreState, WebstoreContext>({
        prefix: '/api'
    });
    
    /**
 * @apiDefine Base
 * @apiParam (Base) {Integer} id The unique identifier of the item.
 */

/**
 * @apiDefine idParam
 * @apiParam (Path) {Integer} id Id of the item to fetch/update/delete.
 */

/**
 * @apiDefine bearerAuth
 * @apiHeader (Header) {String} Authorization Bearer token for authentication.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * 
* 
* @apiDefine 400BadRequest
* @apiError (Error 400) BadRequest You provided invalid data.
*/

/**
* @apiDefine 401Unauthorized
* @apiError (Error 401) Unauthorized You need to be authenticated to access this resource.
*/

/**
* @apiDefine 403Forbidden
* @apiError (Error 403) Forbidden You don't have access to this resource.
*/

/**
* @apiDefine 404NotFound
* @apiError (Error 404) NotFound The requested resource could not be found.
*/


  
    installHealthRouter(router);
    installOrderRouter(router);
    installProductsRouter(router);
    installUserRouter(router);
    installSessionRouter(router);
    
    
    app.use(router.routes()).use(router.allowedMethods());
}
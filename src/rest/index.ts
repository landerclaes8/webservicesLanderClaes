import type Application from 'koa';

import Router from '@koa/router';
import installWinkelmandRouter from './winkelmand';
import instalFavorietRouter from './favoriet';
import installHealthRouter from './health';
import installProductsRouter from './products';
import { KoaApplication, WebstoreContext, WebstoreState } from '../types/koa';


export default (app: KoaApplication) => {
    const router = new Router<WebstoreState, WebstoreContext>({
        prefix: '/api'
    });
    
    //routes toevoegen naar verschillende componenten
    // to do voor favoriet en user eventueel
    installHealthRouter(router);
    installWinkelmandRouter(router);
    installProductsRouter(router);
    instalFavorietRouter(router);

    

    app.use(router.routes()).use(router.allowedMethods());
}
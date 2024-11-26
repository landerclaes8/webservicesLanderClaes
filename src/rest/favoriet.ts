import Router from '@koa/router';
import type { WebstoreContext, WebstoreState } from "../types/koa";
import type { KoaContext, KoaRouter } from "../types/koa";

import * as favorietService from '../service/favoriet';
import { GetFavorietByIdResponse, NieuwItemFavorietRequest, VerwijderUitFavorietRequest, VerwijderUitFavorietResponse } from '../types/favorietProduct';
import { IdParams } from '../types/common';


export const getFavorietById =  async (ctx: KoaContext<GetFavorietByIdResponse, IdParams>) => {
  try{
     ctx.body = await favorietService.getById(Number(ctx.params.id));
  }catch(error){
    ctx.status = 404;
    ctx.body = {error: 'Geen favoriet met dit id'};
  };
};

//Number is nodig omdat data in JSON formaat binnenkomt en moet worden omgezet. Altijd omzetten naar juiste type
const voegtoeAanFavoriet =  async (ctx: KoaContext<NieuwItemFavorietRequest, IdParams>) => {
    
    const {productId} = ctx.request.body as NieuwItemFavorietRequest
  try{
    const favorietProduct = await favorietService.voegToeById(Number(ctx.params.id), {productId});
    ctx.status = 201;
    ctx.body = favorietProduct;
  }catch(error) {
    if ((error as { code: string }).code === 'P2002') { // Prisma error code als er een dubbele waarde wordt toegevoegd
        ctx.status = 409;
        ctx.body = { error: 'Product already exists in favorietenlijst' };
    } else {
        ctx.status = 500;
        const errorMessage = (error as Error).message;
        ctx.body = { error: 'An internal error occurred', details: errorMessage };
    }
  };
 };

const verwijderUitFavorieten = async (ctx: KoaContext<VerwijderUitFavorietResponse, IdParams, VerwijderUitFavorietRequest>) => {
   try{
      await favorietService.verwijderById(Number(ctx.params.id), ctx.request.body);
      ctx.status = 200;
   } catch (error) {
    if ((error as { code: string }).code === 'P2025') { // Prisma error code als item niet gevonden wordt
        ctx.status = 404;
        ctx.body = { error: 'Product not found in winkelmand' };
    } else {
        ctx.status = 500;
        const errorMessage = (error as Error).message;
        ctx.body = { error: 'An internal error occurred', details: errorMessage };
    }
  };  
};


  export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({
      prefix: '/favoriet',
    });


  router.get('/:id', getFavorietById);
  router.post('/:id', voegtoeAanFavoriet);//id en kledingid moeten in body staan
  router.delete('/:id', verwijderUitFavorieten)


  parent.use(router.routes()).use(router.allowedMethods());
}
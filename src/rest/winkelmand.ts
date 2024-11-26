//routing van index naar service
import Router from '@koa/router';
import type { WebstoreContext, WebstoreState } from "../types/koa";
import type { KoaContext, KoaRouter } from "../types/koa";
import type {
  NieuwItemWinkelmandRequest,
  GetWinkelmandByIdResponse,
  VerwijderUitWinkelmandRequest
} from '../types/winkelmandProduct'
import type { IdParams } from "../types/common";
import * as winkelmandService from '../service/winkelmand';

const getWinkelmandById =  async (ctx: KoaContext<GetWinkelmandByIdResponse, IdParams>) => {
  try{
    const winkelmand = await winkelmandService.getById(Number(ctx.params.id));
    ctx.body = winkelmand;  
  }catch (error) {
    ctx.status = 404;
    ctx.body = { error: 'Geen winkelmand met dit id' };
}
  };


//Number is nodig omdat data in JSON formaat binnenkomt en moet worden omgezet. Altijd omzetten naar juiste type
const voegtoeAanWinkelmand =  async (ctx: KoaContext<NieuwItemWinkelmandRequest | { error: string }, IdParams>) => {
  const winkelmandId = Number(ctx.params.id);
  const { productId } = ctx.request.body as NieuwItemWinkelmandRequest;

  try{
     const winkelmandProduct = await winkelmandService.voegToeById(winkelmandId, { productId });
    ctx.status = 201;
    ctx.body = winkelmandProduct  
  } catch (error) {
    if ((error as { code: string }).code === 'P2002') { // Prisma error code als er een dubbele waarde wordt toegevoegd
        ctx.status = 409;
        ctx.body = { error: 'Product already exists in winkelmand' };
    } else {
        ctx.status = 500;
        const errorMessage = (error as Error).message;
        ctx.body = { error: 'An internal error occurred', details: errorMessage };
    }
}
   
  };

const verwijderUitWinkelmand = async (ctx: KoaContext<{ message: string } | { error: string, details?: string }, IdParams>) => {
 
  const winkelmandId = Number(ctx.params.id);
  const { productId } = ctx.request.body as VerwijderUitWinkelmandRequest;

  try {
        await winkelmandService.verwijderById(winkelmandId, { productId });
        ctx.status = 200;
        ctx.body = { message: 'Product removed from winkelmand' };
    } catch (error) {
        if ((error as { code: string }).code === 'P2025') { // Prisma error code als item niet gevonden wordt
            ctx.status = 404;
            ctx.body = { error: 'Product not found in winkelmand' };
        } else {
            ctx.status = 500;
            const errorMessage = (error as Error).message;
            ctx.body = { error: 'An internal error occurred', details: errorMessage };
        }
    }

  };
    
  // één functie
  export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({
      prefix: '/winkelmand',
    });


  router.get('/:id', getWinkelmandById); // eventueel mogelijk maken dat ke ipv kledingId, volledige kleding met merk,... terug krijgt
  router.post('/:id', voegtoeAanWinkelmand);//id en kledingid moeten in body staan
  router.delete('/:id', verwijderUitWinkelmand)


  parent.use(router.routes()).use(router.allowedMethods());
}
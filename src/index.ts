import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import installRest from './rest';
import config from 'config';
import koaCors from '@koa/cors';
import { initializeData } from './data'; //alles van data toevoegen, doet beroep op index.ts in data
import { WebstoreContext, WebstoreState } from './types/koa';

const CORS_ORIGINS = config.get<string[]>('cors.origins'); // komt uit config/development en production
const CORS_MAX_AGE = config.get<number>('cors.maxAge'); 


const app = new Koa<WebstoreState, WebstoreContext>();

async function main() : Promise<void>{



app.use(
  koaCors({ //koaCors zorgt ervoor dat front end kan communiceren met backend
  
    origin: (ctx) => {
      
      if (CORS_ORIGINS.indexOf(ctx.request.header.origin!) !== -1) {
        return ctx.request.header.origin!;
      }
      // Not a valid domain at this point, let's return the first valid as we should return a string
      return CORS_ORIGINS[0] || ''; 
    },
 
    allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
    maxAge: CORS_MAX_AGE, 
  }),
);


app.use(bodyParser());

await initializeData(); //datalaag instellen

installRest(app);

app.listen(9000, () => {
  getLogger().info('Starting server...');
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});

}

//main functie aanroepen, zorgt voor de opstart van alles
main();




/*

router.get('/api/winkelmand/:id', async (ctx) => {
  ctx.body = fullWinkelmand.getById(Number(ctx.params.id));
  
});

router.get('/api/favoriet', async (ctx) => {
  ctx.body = {
    items: favoriet.getAll(),
  };
});

//Number is nodig omdat data in JSON formaat binnenkomt en moet worden omgezet. Altijd omzetten naar juiste type
router.post('/api/winkelmand', async (ctx) => {
  const { userId, kledingId } = ctx.request.body as { userId: string, kledingId: string };
  fullWinkelmand.voegToeById(Number(userId), Number(kledingId));
  //zeggen tegen client dat opdracht succesvol is gelukt
  ctx.status = 200;
  ctx.body = { message: 'item toegevoegd aan winkelmand'};
})

*/




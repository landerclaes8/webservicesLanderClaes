// src/types/koa.ts
import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth'


export interface WebstoreState {
  session: SessionInfo;
} 

//unknown zijn tijdelijk, types moeten voldoen aan eigen project
export interface WebstoreContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

// hier hetzelfde, die unknown moet weg
export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = 
ParameterizedContext<
  
  WebstoreState,
  WebstoreContext<Params, RequestBody, Query>,
  ResponseBody
>;


export interface KoaApplication
  extends Application<WebstoreState, WebstoreContext> {}


export interface KoaRouter extends Router<WebstoreState, WebstoreContext> {}

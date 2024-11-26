//routing naar servicelaag
import Router from '@koa/router';
import * as productService from '../service/products';
import { IdParams } from '../types/common';
import type { KoaContext, KoaRouter, WebstoreContext, WebstoreState } from '../types/koa';
import type { GetAllProductsResponse, GetProductByIdResponse, CreateProductResponse, CreateProductRequest, UpdateProductResponse, UpdateProductRequest } from '../types/product';


const getAllProducts = async (ctx: KoaContext<GetAllProductsResponse>) => {
    const products = await productService.getAll();
    ctx.body = {
        items: products
    };
};

const getProductById = async (ctx: KoaContext<GetProductByIdResponse, IdParams>) => {
    const product = await productService.getById(Number(ctx.params.id));
    ctx.body = product;
}

const createProduct = async (ctx: KoaContext<CreateProductResponse, void, CreateProductRequest>) => {
    const product = await productService.createProduct(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
}

const updateProduct = async (ctx: KoaContext<UpdateProductResponse, IdParams, UpdateProductRequest>) => {
    const product = await productService.updateProductById(Number(ctx.params.id), ctx.request.body);
    ctx.body = product;
}

const deleteProduct = async (ctx: KoaContext<void, IdParams>) =>{
    await productService.deleteById(Number(ctx.params.id));
    ctx.status = 204;
}


export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({
      prefix: '/products',
    });
  
    //router.use(requireAuthentication);
  
    router.get('/', getAllProducts);
    router.get('/:id', getProductById );
    router.post('/', createProduct);
    router.put('/:id', updateProduct );
    router.delete('/:id', deleteProduct);
  
   
  
    parent.use(router.routes())
      .use(router.allowedMethods());
  };
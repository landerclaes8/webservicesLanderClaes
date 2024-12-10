//routing naar servicelaag
import Router from '@koa/router';
import * as productService from '../service/products';
import { IdParams } from '../types/common';
import type { KoaContext, KoaRouter, WebstoreContext, WebstoreState } from '../types/koa';
import type { GetAllProductsResponse, GetProductByIdResponse, CreateProductResponse, CreateProductRequest, UpdateProductResponse, UpdateProductRequest } from '../types/product';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /products Get all products
 * @apiName GetAllProducts
 * @apiGroup Products
 * @apiSuccess {Object[]} items List of products.
 */

const getAllProducts = async (ctx: KoaContext<GetAllProductsResponse>) => {
    const products = await productService.getAll();
    ctx.body = {
        items: products
    };
};
getAllProducts.validationScheme = null;

/**
 * @api {get} /products/:id Get product by ID
 * @apiName GetProductById
 * @apiGroup Products
 * @apiParam {Number} id Product's unique ID.
 * @apiSuccess {Object} product Product details.
 * @apiError (404) NotFound No product with this ID exists.
 */

const getProductById = async (ctx: KoaContext<GetProductByIdResponse, IdParams>) => {
    const product = await productService.getById(Number(ctx.params.id));
    ctx.body = product; 
};
getProductById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    }
};

/**
 * @api {post} /products Create a new product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiPermission admin
 * @apiBody {Number} prijs Product price.
 * @apiBody {String} soort Product type.
 * @apiBody {String} merk Product brand.
 * @apiBody {String} kleur Product color.
 * @apiBody {String} maat Product size.
 * @apiBody {String} stofsoort Product fabric type.
 * @apiSuccess {Object} product Created product details.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (400) VALIDATION_FAILED
 */

const createProduct = async (ctx: KoaContext<CreateProductResponse, void, CreateProductRequest>) => {

    const product = await productService.createProduct(ctx.request.body, ctx.state.session.roles);
    ctx.status = 201;
    ctx.body = product;
};
createProduct.validationScheme = {
    body: {
        prijs: Joi.number().positive().required(),
        soort: Joi.string().required(),
        merk: Joi.string().required(),
        kleur: Joi.string().required(),
        maat: Joi.string().required(),
        stofsoort: Joi.string().required(),
    }
};

/**
 * @api {put} /products/:id Update a product
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiPermission admin
 * @apiParam {Number} id Product's unique ID.
 * @apiBody {Number} prijs Product price.
 * @apiBody {String} soort Product type.
 * @apiBody {String} merk Product brand.
 * @apiBody {String} kleur Product color.
 * @apiBody {String} maat Product size.
 * @apiBody {String} stofsoort Product fabric type.
 * @apiSuccess {Object} product Updated product details.
 * @apiError (404) NotFound No product with this ID exists.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (400) VALIDATION_FAILED
 */

const updateProduct = async (ctx: KoaContext<UpdateProductResponse, IdParams, UpdateProductRequest>) => {
    const product = await productService.updateProductById(Number(ctx.params.id), ctx.request.body, ctx.state.session.roles);
    ctx.body = product;
};
updateProduct.validationScheme = {
    body: {
        prijs: Joi.number().positive().required(),
        soort: Joi.string().required(),
        merk: Joi.string().required(),
        kleur: Joi.string().required(),
        maat: Joi.string().required(),
        stofsoort: Joi.string().required(),
    }
};

/**
 * @api {delete} /products/:id Delete a product
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiPermission admin
 * @apiParam {Number} id Product's unique ID.
 * @apiSuccess {Void} 204 No Content.
 * @apiError (404) NotFound No product with this ID exists.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (400) VALIDATION_FAILED
 */

const deleteProduct = async (ctx: KoaContext<void, IdParams>) =>{
    await productService.deleteById(Number(ctx.params.id), ctx.state.session.roles);
    ctx.status = 204;
};
deleteProduct.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};


export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({
      prefix: '/products',
    });
  
   router.use(requireAuthentication);
  
    router.get('/', validate(getAllProducts.validationScheme), getAllProducts);
    router.get('/:id', validate(getProductById.validationScheme), getProductById);
    router.post('/', validate(createProduct.validationScheme), createProduct);
    router.put('/:id', validate(updateProduct.validationScheme), updateProduct);
    router.delete('/:id', validate(deleteProduct.validationScheme), deleteProduct);
  
   
  
    parent.use(router.routes())
      .use(router.allowedMethods());
  };
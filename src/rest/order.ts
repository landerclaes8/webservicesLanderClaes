import Router from '@koa/router';
import type { IdParams } from '../types/common';
import type { KoaContext, KoaRouter, WebstoreContext, WebstoreState } from '../types/koa';
import { createOrderRequest, createOrderResponse, getAllOrdersResponse, getOrderByIdResponse} from '../types/order';
import * as orderService from '../service/order';
import * as orderProductService from '../service/orderProduct';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /orders Get all orders
 * @apiName GetAllOrders
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Object[]} items List of orders.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (400) VALIDATION_FAILED
 */

const getAllOrders = async (ctx: KoaContext<getAllOrdersResponse>) => {
    ctx.body = {
        items: await orderService.getAll(ctx.state.session.roles, ctx.state.session.userId)
    };
};
getAllOrders.validationScheme = null;

/**
 * @api {get} /orders/:id Get order by ID
 * @apiName GetOrderById
 * @apiGroup Orders
 * @apiPermission user
 * @apiParam {Number} id Order's unique ID.
 * @apiSuccess {Object} order Order details.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (400) VALIDATION_FAILED
 * @apiError (404) NOT_FOUND No order with this id exists
 */

const getOrderById = async (ctx:KoaContext<getOrderByIdResponse, IdParams>) => {
    ctx.body = await orderService.getById(
        ctx.params.id, ctx.state.session.roles, ctx.state.session.userId
    );
};
getOrderById.validationScheme = {
    params: {
        id: Joi.number().integer().positive().required(),
    }
};

/**
 * @api {post} /orders Create a new order
 * @apiName CreateOrder
 * @apiGroup Orders
 * @apiPermission user
 * @apiBody {Object[]} orderProducts List of order products.
 * @apiBody {Number} orderProducts.productId Product ID.
 * @apiBody {Number} orderProducts.aantal Quantity of the product.
 * @apiSuccess {Object} order Created order details.
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (400) VALIDATION_FAILED
 */

const voegOrderToe = async (ctx: KoaContext<createOrderResponse, void, createOrderRequest>) => {
    const newOrder = await orderService.voegToeById({
        userId: ctx.state.session.userId, // is dit correct om userId te bekomen van ingelogde user?
        date: new Date(),
        orderProducts: ctx.request.body.orderProducts,
    });

  
    const orderProducts = ctx.request.body.orderProducts.map((op: { productId: number; aantal: number }) => ({
        orderId: newOrder.id, // is dit correct om zo het id van het net aangemaakte order op te vragen
        productId: op.productId,
        aantal: op.aantal,
    }));

    await Promise.all(orderProducts.map(orderProductService.voegtoe));

    ctx.status = 201;
    ctx.body = newOrder, orderProducts;
};
voegOrderToe.validationScheme = {
    body: {
        orderProducts: Joi.array()
    }
};

/**
 * @api {delete} /orders/:id Delete order by ID
 * @apiName DeleteOrder
 * @apiGroup Orders
 * @apiPermission user
 * @apiParam {Number} id Order's unique ID.
 * @apiSuccess {Void} 204 No Content.
 * @apiError (403) Forbidden You are not allowed to view this part of the application
 * @apiError (401) UNAUTHORIZED The token has expired
 * @apiError (404) NOT_FOUND No order with this id exists
 * @apiError (400) VALIDATION_FAILED
 */

const verwijderOrder = async(ctx: KoaContext<void, IdParams>) => {
    //verwijderen van order
    await orderService.verwijderById(ctx.params.id, ctx.state.session.roles, ctx.state.session.userId);

    //verwijderen van alle bijhorende orderProducts
    await orderProductService.deleteByOrderId(ctx.params.id);
    ctx.status = 204;
};
verwijderOrder.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

export default (parent: KoaRouter) => {
    const router = new Router<WebstoreState, WebstoreContext>({
      prefix: '/orders',
    });
  
    router.use(requireAuthentication);
  
    router.get('/',  validate(getAllOrders.validationScheme), getAllOrders);
    router.post('/', validate(voegOrderToe.validationScheme), voegOrderToe);
    router.get('/:id',  validate(getOrderById.validationScheme), getOrderById);
    router.delete('/:id', validate(verwijderOrder.validationScheme), verwijderOrder);
  
    parent.use(router.routes())
      .use(router.allowedMethods());
  };




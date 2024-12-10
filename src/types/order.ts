import type { Entity, ListResponse } from "./common";
import {OrderProductCreateInput } from "./orderProduct";
//import type { User } from "./user";

export interface Order extends Entity {
    
    date: Date
}

export interface OrderCreateInput{
    
    userId: number,
    date: Date,
    orderProducts: OrderProductCreateInput[]
    
}


export interface createOrderRequest extends OrderCreateInput{}

export interface createOrderResponse extends Order{}

export interface getAllOrdersResponse extends ListResponse<Order>{}
export interface getOrderByIdResponse extends Order{}


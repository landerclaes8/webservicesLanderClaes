
import { ListResponse } from "./common";


export interface OrderProduct{
    orderId: number;
    productId: number;
    aantal: number;
};


export interface OrderProductCreateInput {
    orderId: number;
    productId: number;
    aantal: number;
};

//type voor array van alle producten in winkelmand
export interface GetAllOrderProductResponse extends ListResponse<OrderProduct>{};
//export interface GetWinkelmandByIdResponse extends ProductArrayResponse {}

export interface GetOrderProductByIdResponse extends ListResponse<OrderProduct>{};
export interface CreateOrderProductResponse extends OrderProductCreateInput{};
export interface CreateOrderProductRequest extends GetOrderProductByIdResponse {};











